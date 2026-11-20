import { USE_MOCK } from './config';
import { request } from './api';
import * as mock from './vehicleMock';

const fromApi = (v) => ({
  id: v.id,
  name: v.name,
  group: v.group,
  registrationStatus: v.registration_status,
  gatewayStatus: v.gateway_status,
  ecus: (v.ecus || []).map((e) => ({ name: e.name, firmwareVersion: e.firmware_version })),
});

async function realList() {
  return (await request('/vehicles')).map(fromApi);
}

async function realById(id) {
  return fromApi(await request(`/vehicles/${id}`));
}

export const getVehicles = USE_MOCK ? mock.getVehicles : realList;
export const getVehicleById = USE_MOCK ? mock.getVehicleById : realById;