import json
import threading

import paho.mqtt.client as mqtt

from app.config import (
    MQTT_HOST,
    MQTT_PASSWORD,
    MQTT_PORT,
    MQTT_TLS,
    MQTT_TOPIC_PREFIX,
    MQTT_USERNAME,
)

_client = None
_lock = threading.Lock()


def _get_client() -> mqtt.Client:
    """Connect lazily on first publish. paho auto-reconnects after the first connect."""
    global _client
    with _lock:
        if _client is None:
            c = mqtt.Client(mqtt.CallbackAPIVersion.VERSION2, client_id="ota-backend")
            if MQTT_USERNAME:
                c.username_pw_set(MQTT_USERNAME, MQTT_PASSWORD)
            if MQTT_TLS:
                c.tls_set()
            c.connect(MQTT_HOST, MQTT_PORT, keepalive=60)
            c.loop_start()
            _client = c
        return _client


def publish_update(vehicle_id: str, payload: dict) -> None:
    """Publish to ota/<vehicle_id>/update with QoS 1. Raises on failure."""
    topic = f"{MQTT_TOPIC_PREFIX}/{vehicle_id}/update"
    info = _get_client().publish(topic, json.dumps(payload), qos=1)
    info.wait_for_publish(timeout=5)
    if not info.is_published():
        raise RuntimeError("Broker did not acknowledge the message.")