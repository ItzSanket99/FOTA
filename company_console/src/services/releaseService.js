import { USE_MOCK } from './config';
import { request } from './api';
import * as mock from './releaseMock';

const fromApi = (r) => ({
  id: r.id,
  firmwareId: r.firmware_id,
  version: r.version,
  targetEcu: r.target_ecu,
  vehicleIds: r.vehicle_ids,
  createdAt: r.created_at,
  status: r.status,
  failedVehicleIds: r.failed_vehicle_ids || [],
});

async function realList() {
  return (await request('/releases')).map(fromApi);
}

// Backend validates eligibility, marks firmware Released and publishes MQTT.
async function realCreate({ firmwareId, vehicleIds }) {
  const r = await request('/releases', {
    method: 'POST',
    body: { firmware_id: firmwareId, vehicle_ids: vehicleIds },
  });
  return fromApi(r);
}

export const getReleases = USE_MOCK ? mock.getReleases : realList;
export const createRelease = USE_MOCK ? mock.createRelease : realCreate;