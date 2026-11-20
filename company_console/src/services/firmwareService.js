import { USE_MOCK } from './config';
import { request } from './api';
import * as mock from './firmwareMock';

// Backend is snake_case, the UI is camelCase. Mapped once, here.
const fromApi = (f) => ({
  id: f.id,
  version: f.version,
  targetEcu: f.target_ecu,
  fileName: f.file_name,
  fileSize: f.file_size,
  description: f.description,
  uploadDate: f.uploaded_at,
  status: f.status,
  sha256: f.sha256 ?? null,
});

async function realList() {
  return (await request('/firmware')).map(fromApi);
}

async function realById(id) {
  return fromApi(await request(`/firmware/${id}`));
}

async function realUpload({ file, version, targetEcu, description }) {
  const body = new FormData();
  body.append('file', file);
  body.append('version', version.trim());
  body.append('target_ecu', targetEcu);
  body.append('description', description.trim());
  return fromApi(await request('/firmware', { method: 'POST', body, isForm: true }));
}

async function realDelete(id) {
  await request(`/firmware/${id}`, { method: 'DELETE' });
  return true;
}

// TEMPORARY: the mock release flow still calls this. In real mode the backend
// will own the status change in Step 4, so this is a no-op until then.
async function realMarkReleased(id) {
  return realById(id);
}

export const getFirmwareList = USE_MOCK ? mock.getFirmwareList : realList;
export const getFirmwareById = USE_MOCK ? mock.getFirmwareById : realById;
export const uploadFirmware = USE_MOCK ? mock.uploadFirmware : realUpload;
export const deleteFirmware = USE_MOCK ? mock.deleteFirmware : realDelete;
export const markFirmwareReleased = USE_MOCK ? mock.markFirmwareReleased : realMarkReleased;