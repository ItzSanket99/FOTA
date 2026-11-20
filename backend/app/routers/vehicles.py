from fastapi import APIRouter, HTTPException

from app.db import supabase

router = APIRouter(prefix="/vehicles", tags=["vehicles"])


def to_api(r: dict) -> dict:
    return {
        "id": r["id"],
        "name": r["name"],
        "group": r["vehicle_group"],
        "registration_status": r["registration_status"],
        "gateway_status": r["gateway_status"],
        "ecus": r["ecus"],
    }


@router.get("")
def list_vehicles():
    res = supabase.table("vehicles").select("*").order("id").execute()
    return [to_api(r) for r in res.data]


@router.get("/{vehicle_id}")
def get_vehicle(vehicle_id: str):
    res = supabase.table("vehicles").select("*").eq("id", vehicle_id).limit(1).execute()
    if not res.data:
        raise HTTPException(status_code=404, detail="Vehicle not found.")
    return to_api(res.data[0])