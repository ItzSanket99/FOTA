import os
from dotenv import load_dotenv

load_dotenv()

SUPABASE_URL = os.environ["SUPABASE_URL"]
SUPABASE_SERVICE_KEY = os.environ["SUPABASE_SERVICE_KEY"]
FIRMWARE_BUCKET = os.getenv("FIRMWARE_BUCKET", "firmware")
CORS_ORIGINS = [o.strip() for o in os.getenv("CORS_ORIGINS", "").split(",") if o.strip()]

MQTT_HOST = os.environ["MQTT_HOST"]
MQTT_PORT = int(os.getenv("MQTT_PORT", "8883"))
MQTT_USERNAME = os.environ["MQTT_USERNAME"]
MQTT_PASSWORD = os.environ["MQTT_PASSWORD"]
MQTT_TOPIC_PREFIX = os.getenv("MQTT_TOPIC_PREFIX", "ota")

DOWNLOAD_URL_TTL = int(os.getenv("DOWNLOAD_URL_TTL", "86400"))  # seconds