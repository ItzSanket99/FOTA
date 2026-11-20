import hashlib
import os
import re
import uuid

from fastapi import APIRouter, File, Form, HTTPException, Response, UploadFile

from app.config import FIRMWARE_BUCKET
from app.db import supabase

router = APIRouter(prefix="/firmware", tags=["firmware"])

# Must match ECU_OPTIONS in the console's src/data/mockFirmware.js
ALLOWED_ECUS = {"Engine ECU", "Body Control ECU", "Brake ECU", "Instrument Cluster ECU"}
MAX_SIZE = 2 * 1024 * 1024  # keep in sync with the console limit / STM32 flash partition
VERSION_RE = re.compile(r"^\d+\.\d+\.\d+$")
TABLE = "firmware"


def to_api(row: dict) -> dict:
    return {
        "id": row["id"],
        "version": row["version"],
        "target_ecu": row["target_ecu"],
        "file_name": row["file_name"],
        "file_size": row["file_size"],
        "description": row["description"],
        "uploaded_at": row["uploaded_at"],
        "status": row["status"],
        "sha256": row["sha256"],
    }


def get_row(firmware_id: str) -> dict:
    res = supabase.table(TABLE).select("*").eq("id", firmware_id).limit(1).execute()
    if not res.data:
        raise HTTPException(status_code=404, detail="Firmware record not found.")
    return res.data[0]


@router.get("")
def list_firmware():
    res = supabase.table(TABLE).select("*").order("uploaded_at", desc=True).execute()
    return [to_api(r) for r in res.data]


@router.get("/{firmware_id}")
def get_firmware(firmware_id: str):
    return to_api(get_row(firmware_id))


@router.post("", status_code=201)
def upload_firmware(
    file: UploadFile = File(...),
    version: str = Form(...),
    target_ecu: str = Form(...),
    description: str = Form(...),
):
    version = version.strip()
    description = description.strip()

    if not (file.filename or "").lower().endswith(".bin"):
        raise HTTPException(status_code=422, detail="Only .bin files are allowed.")
    if not VERSION_RE.match(version):
        raise HTTPException(status_code=422, detail="Version must be MAJOR.MINOR.PATCH.")
    if target_ecu not in ALLOWED_ECUS:
        raise HTTPException(status_code=422, detail="Unknown target ECU.")
    if not description or len(description) > 300:
        raise HTTPException(status_code=422, detail="Description must be 1-300 characters.")

    data = file.file.read(MAX_SIZE + 1)
    if len(data) == 0:
        raise HTTPException(status_code=422, detail="File is empty.")
    if len(data) > MAX_SIZE:
        raise HTTPException(status_code=422, detail="File exceeds the size limit.")

    dup = (
        supabase.table(TABLE)
        .select("id")
        .eq("version", version)
        .eq("target_ecu", target_ecu)
        .execute()
    )
    if dup.data:
        raise HTTPException(
            status_code=409, detail=f"Version {version} already exists for {target_ecu}."
        )

    sha256 = hashlib.sha256(data).hexdigest()
    safe_name = re.sub(r"[^A-Za-z0-9._-]", "_", os.path.basename(file.filename))
    storage_path = f"{uuid.uuid4()}/{safe_name}"

    try:
        supabase.storage.from_(FIRMWARE_BUCKET).upload(
            storage_path, data, {"content-type": "application/octet-stream"}
        )
    except Exception as exc:
        raise HTTPException(status_code=502, detail=f"Storage upload failed: {exc}")

    try:
        res = (
            supabase.table(TABLE)
            .insert(
                {
                    "version": version,
                    "target_ecu": target_ecu,
                    "file_name": file.filename,
                    "file_size": len(data),
                    "description": description,
                    "storage_path": storage_path,
                    "sha256": sha256,
                }
            )
            .execute()
        )
    except Exception as exc:
        # Don't leave an orphan file in the bucket if the DB insert fails.
        supabase.storage.from_(FIRMWARE_BUCKET).remove([storage_path])
        raise HTTPException(status_code=500, detail=f"Database insert failed: {exc}")

    return to_api(res.data[0])


@router.delete("/{firmware_id}", status_code=204)
def delete_firmware(firmware_id: str):
    row = get_row(firmware_id)
    if row["status"] == "Released":
        raise HTTPException(status_code=409, detail="Released firmware cannot be deleted.")
    supabase.storage.from_(FIRMWARE_BUCKET).remove([row["storage_path"]])
    supabase.table(TABLE).delete().eq("id", firmware_id).execute()
    return Response(status_code=204)
