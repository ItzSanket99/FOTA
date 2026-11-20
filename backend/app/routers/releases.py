from datetime import datetime, timezone
from uuid import UUID

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

from app.config import DOWNLOAD_URL_TTL, FIRMWARE_BUCKET, SUPABASE_URL
from app.db import supabase
from app.mqtt_client import publish_update
from app.routers.firmware import get_row as get_firmware_row

router = APIRouter(prefix="/releases", tags=["releases"])


class ReleaseCreate(BaseModel):
    firmware_id: UUID
    vehicle_ids: list[str] = Field(min_length=1)


def to_api(rel: dict, vehicle_ids: list[str], failed: list[str] | None = None) -> dict:
    return {
        "id": rel["id"],
        "firmware_id": rel["firmware_id"],
        "version": rel["version"],
        "target_ecu": rel["target_ecu"],
        "vehicle_ids": vehicle_ids,
        "created_at": rel["created_at"],
        "status": rel["status"],
        "failed_vehicle_ids": failed or [],
    }


def eligibility_reason(vehicle: dict, fw: dict) -> str | None:
    if vehicle["registration_status"] != "Registered":
        return "Not registered"
    ecu = next((e for e in vehicle["ecus"] if e["name"] == fw["target_ecu"]), None)
    if not ecu:
        return "ECU not fitted"
    if ecu["firmware_version"] == fw["version"]:
        return "Already on this version"
    return None


def make_download_url(storage_path: str) -> str:
    res = supabase.storage.from_(FIRMWARE_BUCKET).create_signed_url(
        storage_path, DOWNLOAD_URL_TTL
    )
    url = res.get("signedURL") or res.get("signedUrl")
    if not url:
        raise HTTPException(status_code=502, detail="Could not create download URL.")
    if not url.startswith("http"):
        base = SUPABASE_URL if url.startswith("/storage/v1") else f"{SUPABASE_URL}/storage/v1"
        url = f"{base}{url}"
    return url


@router.get("")
def list_releases():
    rels = supabase.table("releases").select("*").order("created_at", desc=True).execute().data
    if not rels:
        return []
    ups = (
        supabase.table("updates")
        .select("release_id, vehicle_id")
        .in_("release_id", [r["id"] for r in rels])
        .execute()
        .data
    )
    by_release: dict[str, list[str]] = {}
    for u in ups:
        by_release.setdefault(u["release_id"], []).append(u["vehicle_id"])
    return [to_api(r, sorted(by_release.get(r["id"], []))) for r in rels]


@router.post("", status_code=201)
def create_release(body: ReleaseCreate):
    vehicle_ids = list(dict.fromkeys(body.vehicle_ids))  # dedupe, keep order
    fw = get_firmware_row(str(body.firmware_id))

    found = {
        v["id"]: v
        for v in supabase.table("vehicles").select("*").in_("id", vehicle_ids).execute().data
    }
    for vid in vehicle_ids:
        v = found.get(vid)
        if not v:
            raise HTTPException(status_code=404, detail=f"Vehicle {vid} not found.")
        reason = eligibility_reason(v, fw)
        if reason:
            raise HTTPException(status_code=422, detail=f"{vid} is not eligible: {reason}.")

    download_url = make_download_url(fw["storage_path"])

    rel = (
        supabase.table("releases")
        .insert({"firmware_id": fw["id"], "version": fw["version"], "target_ecu": fw["target_ecu"]})
        .execute()
        .data[0]
    )
    updates = (
        supabase.table("updates")
        .insert(
            [
                {
                    "release_id": rel["id"],
                    "vehicle_id": vid,
                    "target_ecu": fw["target_ecu"],
                    "firmware_version": fw["version"],
                }
                for vid in vehicle_ids
            ]
        )
        .execute()
        .data
    )
    # Mark released before publishing so the firmware can't be deleted mid-release.
    supabase.table("firmware").update({"status": "Released"}).eq("id", fw["id"]).execute()

    failed: list[str] = []
    for u in updates:
        payload = {
            "update_id": u["id"],
            "release_id": rel["id"],
            "firmware_id": fw["id"],
            "vehicle_id": u["vehicle_id"],
            "target_ecu": fw["target_ecu"],
            "version": fw["version"],
            "file_size": fw["file_size"],
            "sha256": fw["sha256"],
            "download_url": download_url,
            # "signature": added in Step 8 (publisher signing)
        }
        try:
            publish_update(u["vehicle_id"], payload)
            new_status, reason = "Notified", None
        except Exception as exc:
            failed.append(u["vehicle_id"])
            new_status, reason = "Pending", f"MQTT publish failed: {exc}"
        supabase.table("updates").update(
            {
                "status": new_status,
                "failure_reason": reason,
                "updated_at": datetime.now(timezone.utc).isoformat(),
            }
        ).eq("id", u["id"]).execute()

    if not failed:
        rel_status = "Notified"
    elif len(failed) == len(updates):
        rel_status = "Pending"
    else:
        rel_status = "Partial"
    rel = (
        supabase.table("releases").update({"status": rel_status}).eq("id", rel["id"]).execute().data[0]
    )

    return to_api(rel, vehicle_ids, failed)