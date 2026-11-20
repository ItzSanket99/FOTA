// Annotates each vehicle with its current version for the firmware's ECU,
// and a `reason` string if it cannot receive this release.
export function getEligibleVehicles(vehicles, firmware) {
  if (!firmware) return [];
  return vehicles.map((v) => {
    const ecu = v.ecus.find((e) => e.name === firmware.targetEcu);
    let reason = null;
    if (v.registrationStatus !== 'Registered') reason = 'Not registered';
    else if (!ecu) reason = 'ECU not fitted';
    else if (ecu.firmwareVersion === firmware.version) reason = 'Already on this version';
    return { ...v, currentVersion: ecu ? ecu.firmwareVersion : null, reason };
  });
}

export function getGroups(vehicles) {
  return [...new Set(vehicles.map((v) => v.group))].sort();
}