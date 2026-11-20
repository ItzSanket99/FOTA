import { useMemo, useState } from 'react';
import { getEligibleVehicles, getGroups } from '../../utils/releaseUtils';

const selectClass =
  'w-full rounded border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500';

function ReleaseForm({ firmware, vehicles, onReview }) {
  const [firmwareId, setFirmwareId] = useState('');
  const [selectedIds, setSelectedIds] = useState([]);
  const [error, setError] = useState('');

  const selectedFirmware = firmware.find((f) => f.id === firmwareId) || null;
  const rows = useMemo(
    () => getEligibleVehicles(vehicles, selectedFirmware),
    [vehicles, selectedFirmware]
  );
  const eligibleRows = rows.filter((r) => !r.reason);
  const groups = getGroups(vehicles);

  const handleFirmwareChange = (e) => {
    setFirmwareId(e.target.value);
    setSelectedIds([]); // eligibility depends on firmware
    setError('');
  };

  const toggleVehicle = (id) => {
    setError('');
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const selectGroup = (e) => {
    const group = e.target.value;
    setError('');
    if (!group) return;
    setSelectedIds(eligibleRows.filter((r) => r.group === group).map((r) => r.id));
    e.target.value = '';
  };

  const allSelected = eligibleRows.length > 0 && selectedIds.length === eligibleRows.length;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedFirmware) return setError('Select a firmware package.');
    if (selectedIds.length === 0) return setError('Select at least one vehicle.');
    onReview({
      firmware: selectedFirmware,
      vehicles: rows.filter((r) => selectedIds.includes(r.id)),
    });
  };

  const resetSelection = () => {
    setFirmwareId('');
    setSelectedIds([]);
    setError('');
  };

  // Exposed via key remount from the page after a successful publish.
  return (
    <form onSubmit={handleSubmit} className="rounded-lg bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-lg font-semibold text-gray-800">Create Release</h2>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Firmware Package
          </label>
          <select value={firmwareId} onChange={handleFirmwareChange} className={selectClass}>
            <option value="">Select firmware</option>
            {firmware.map((f) => (
              <option key={f.id} value={f.id}>
                {f.targetEcu} — v{f.version} ({f.fileName})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Target ECU</label>
          <input
            readOnly
            value={selectedFirmware ? selectedFirmware.targetEcu : ''}
            placeholder="Set by selected firmware"
            className={`${selectClass} bg-gray-50 text-gray-600`}
          />
        </div>
      </div>

      {selectedFirmware && (
        <div className="mt-6">
          <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-sm font-medium text-gray-700">
              Target Vehicles ({selectedIds.length} selected)
            </h3>
            <div className="flex items-center gap-3">
              <select onChange={selectGroup} defaultValue="" className="rounded border border-gray-300 px-2 py-1 text-sm">
                <option value="">Select group...</option>
                {groups.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={() =>
                  setSelectedIds(allSelected ? [] : eligibleRows.map((r) => r.id))
                }
                className="text-sm text-blue-600 hover:underline"
              >
                {allSelected ? 'Clear all' : 'Select all eligible'}
              </button>
            </div>
          </div>

          <div className="overflow-x-auto rounded border border-gray-200">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="bg-gray-50 text-xs uppercase text-gray-500">
                  <th className="w-10 px-3 py-2"></th>
                  <th className="px-3 py-2">Vehicle</th>
                  <th className="px-3 py-2">Group</th>
                  <th className="px-3 py-2">Current Version</th>
                  <th className="px-3 py-2">Gateway</th>
                  <th className="px-3 py-2">Eligibility</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.id} className={`border-t border-gray-100 ${r.reason ? 'text-gray-400' : ''}`}>
                    <td className="px-3 py-2">
                      <input
                        type="checkbox"
                        disabled={!!r.reason}
                        checked={selectedIds.includes(r.id)}
                        onChange={() => toggleVehicle(r.id)}
                      />
                    </td>
                    <td className="px-3 py-2">
                      <span className="font-medium">{r.id}</span> · {r.name}
                    </td>
                    <td className="px-3 py-2">{r.group}</td>
                    <td className="px-3 py-2">{r.currentVersion ? `v${r.currentVersion}` : '—'}</td>
                    <td className="px-3 py-2">
                      <span className={r.gatewayStatus === 'Online' ? 'text-green-600' : 'text-gray-500'}>
                        {r.gatewayStatus}
                      </span>
                    </td>
                    <td className="px-3 py-2">{r.reason || 'Eligible'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {error && <p className="mt-4 rounded bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

      <div className="mt-4 flex gap-3">
        <button
          type="submit"
          className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          Review Release
        </button>
        <button
          type="button"
          onClick={resetSelection}
          className="rounded border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
        >
          Reset
        </button>
      </div>
    </form>
  );
}

export default ReleaseForm;
