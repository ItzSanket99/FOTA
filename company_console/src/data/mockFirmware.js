// Placeholder ECU list. Align names/IDs with the backend and STM32 team later.
export const ECU_OPTIONS = [
  'Engine ECU',
  'Body Control ECU',
  'Brake ECU',
  'Instrument Cluster ECU',
];

export const FIRMWARE_STATUS = {
  UPLOADED: 'Uploaded',
  RELEASED: 'Released',
};

export const mockFirmware = [
  {
    id: 'fw-001',
    version: '1.0.0',
    targetEcu: 'Engine ECU',
    fileName: 'engine_ecu_v1.0.0.bin',
    fileSize: 48320,
    description: 'Initial production release.',
    uploadDate: '2026-10-02T09:15:00.000Z',
    status: FIRMWARE_STATUS.RELEASED,
  },
  {
    id: 'fw-002',
    version: '1.1.0',
    targetEcu: 'Engine ECU',
    fileName: 'engine_ecu_v1.1.0.bin',
    fileSize: 50176,
    description: 'Improved fuel map calibration.',
    uploadDate: '2026-10-20T11:40:00.000Z',
    status: FIRMWARE_STATUS.UPLOADED,
  },
  {
    id: 'fw-003',
    version: '2.0.1',
    targetEcu: 'Brake ECU',
    fileName: 'brake_ecu_v2.0.1.bin',
    fileSize: 36864,
    description: 'ABS threshold fix.',
    uploadDate: '2026-11-05T14:05:00.000Z',
    status: FIRMWARE_STATUS.RELEASED,
  },
  {
    id: 'fw-004',
    version: '0.9.3',
    targetEcu: 'Body Control ECU',
    fileName: 'bcm_v0.9.3.bin',
    fileSize: 29696,
    description: 'Beta build with updated lighting control.',
    uploadDate: '2026-11-12T16:30:00.000Z',
    status: FIRMWARE_STATUS.UPLOADED,
  },
];