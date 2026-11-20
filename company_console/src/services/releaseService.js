import { getFirmwareById, markFirmwareReleased } from './firmwareService';
import { getVehicles } from './vehicleService';
import { getEligibleVehicles } from '../utils/releaseUtils';

// In-memory store. Real version: POST to FastAPI, which stores the release
// and publishes the MQTT notification to each target gateway.
let releases = [];

const delay = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms));

export async function getReleases() {
  await delay(200);
  return [...releases].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

export async function createRelease({ firmwareId, vehicleIds }) {
  await delay(700);

  if (!vehicleIds || vehicleIds.length === 0) {
    throw new Error('Select at least one vehicle.');
  }

  const firmware = await getFirmwareById(firmwareId);
  const vehicles = await getVehicles();
  const eligible = getEligibleVehicles(vehicles, firmware);

  // Re-validate here so the rule holds even if the UI is bypassed.
  for (const id of vehicleIds) {
    const v = eligible.find((x) => x.id === id);
    if (!v) throw new Error(`Vehicle ${id} not found.`);
    if (v.reason) throw new Error(`${id} is not eligible: ${v.reason}.`);
  }

  const release = {
    id: `rel-${Date.now()}`,
    firmwareId: firmware.id,
    version: firmware.version,
    targetEcu: firmware.targetEcu,
    vehicleIds: [...vehicleIds],
    createdAt: new Date().toISOString(),
    status: 'Pending',
  };
  releases = [release, ...releases];
  await markFirmwareReleased(firmware.id);
  return { ...release };
}
