import { mockFirmware, FIRMWARE_STATUS } from '../data/mockFirmware';

// In-memory store, replaced by FastAPI calls once endpoints are agreed with the backend dev.
// Keep these exported function signatures stable so the UI never changes.
let store = [...mockFirmware];

const delay = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms));

export async function getFirmwareList() {
  await delay();
  return [...store].sort((a, b) => new Date(b.uploadDate) - new Date(a.uploadDate));
}

export async function getFirmwareById(id) {
  await delay(150);
  const record = store.find((f) => f.id === id);
  if (!record) throw new Error('Firmware record not found.');
  return { ...record };
}

export async function uploadFirmware({ file, version, targetEcu, description }) {
  await delay(600);

  const cleanVersion = version.trim();
  const duplicate = store.some(
    (f) => f.version === cleanVersion && f.targetEcu === targetEcu
  );
  if (duplicate) {
    throw new Error(`Version ${cleanVersion} already exists for ${targetEcu}.`);
  }

  const record = {
    id: `fw-${Date.now()}`,
    version: cleanVersion,
    targetEcu,
    fileName: file.name,
    fileSize: file.size,
    description: description.trim(),
    uploadDate: new Date().toISOString(),
    status: FIRMWARE_STATUS.UPLOADED,
  };
  // Real version: send multipart/form-data (file + metadata) to the backend.
  store = [record, ...store];
  return { ...record };
}

export async function deleteFirmware(id) {
  await delay(300);
  const record = store.find((f) => f.id === id);
  if (!record) throw new Error('Firmware record not found.');
  if (record.status === FIRMWARE_STATUS.RELEASED) {
    throw new Error('Released firmware cannot be deleted.');
  }
  store = store.filter((f) => f.id !== id);
  return true;
}

export async function markFirmwareReleased(id) {
  const record = store.find((f) => f.id === id);
  if (!record) throw new Error('Firmware record not found.');
  record.status = FIRMWARE_STATUS.RELEASED;
  return { ...record };
}