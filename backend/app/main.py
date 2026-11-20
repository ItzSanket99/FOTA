from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import CORS_ORIGINS
from app.routers import firmware, releases, vehicles

app = FastAPI(title="OTA Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(firmware.router)
app.include_router(vehicles.router)
app.include_router(releases.router)


@app.get("/health")
def health():
    return {"status": "ok"}