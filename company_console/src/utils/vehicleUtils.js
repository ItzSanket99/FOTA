export const REGISTRATION_OPTIONS = ['Registered', 'Pending'];
export const GATEWAY_OPTIONS = ['Online', 'Offline'];

export function filterVehicles(vehicles, { search, registration, gateway }) {
  const q = search.trim().toLowerCase();
  return vehicles.filter((v) => {
    if (q && !v.id.toLowerCase().includes(q) && !v.name.toLowerCase().includes(q)) return false;
    if (registration && v.registrationStatus !== registration) return false;
    if (gateway && v.gatewayStatus !== gateway) return false;
    return true;
  });
}