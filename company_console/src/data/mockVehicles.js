export const mockVehicles = [
  {
    id: 'VH-1001',
    name: 'Sedan X1',
    group: 'Fleet A',
    registrationStatus: 'Registered',
    gatewayStatus: 'Online',
    ecus: [
      { name: 'Engine ECU', firmwareVersion: '1.0.0' },
      { name: 'Brake ECU', firmwareVersion: '2.0.1' },
    ],
  },
  {
    id: 'VH-1002',
    name: 'Sedan X1',
    group: 'Fleet A',
    registrationStatus: 'Registered',
    gatewayStatus: 'Online',
    ecus: [
      { name: 'Engine ECU', firmwareVersion: '1.0.0' },
      { name: 'Body Control ECU', firmwareVersion: '0.9.0' },
    ],
  },
  {
    id: 'VH-1003',
    name: 'SUV Z2',
    group: 'Fleet B',
    registrationStatus: 'Registered',
    gatewayStatus: 'Offline',
    ecus: [
      { name: 'Engine ECU', firmwareVersion: '1.1.0' },
      { name: 'Brake ECU', firmwareVersion: '2.0.0' },
      { name: 'Instrument Cluster ECU', firmwareVersion: '1.0.0' },
    ],
  },
  {
    id: 'VH-1004',
    name: 'Hatch H3',
    group: 'Fleet B',
    registrationStatus: 'Pending',
    gatewayStatus: 'Offline',
    ecus: [{ name: 'Engine ECU', firmwareVersion: '1.0.0' }],
  },
  {
    id: 'VH-1005',
    name: 'SUV Z2',
    group: 'Fleet B',
    registrationStatus: 'Registered',
    gatewayStatus: 'Online',
    ecus: [
      { name: 'Engine ECU', firmwareVersion: '1.0.0' },
      { name: 'Body Control ECU', firmwareVersion: '0.9.3' },
      { name: 'Brake ECU', firmwareVersion: '2.0.1' },
    ],
  },
];