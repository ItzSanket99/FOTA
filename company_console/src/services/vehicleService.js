import { mockVehicles } from '../data/mockVehicles';

const delay = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms));

export async function getVehicles() {
  await delay();
  return mockVehicles.map((v) => ({ ...v, ecus: v.ecus.map((e) => ({ ...e })) }));
}

export async function getVehicleById(id) {
  await delay(150);
  const vehicle = mockVehicles.find((v) => v.id === id);
  if (!vehicle) throw new Error('Vehicle not found.');
  return { ...vehicle };
}