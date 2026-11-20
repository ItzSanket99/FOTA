const REGISTRATION_STYLES = {
  Registered: 'bg-green-100 text-green-800',
  Pending: 'bg-yellow-100 text-yellow-800',
};

const GATEWAY_STYLES = {
  Online: 'bg-green-100 text-green-800',
  Offline: 'bg-gray-200 text-gray-700',
};

function Badge({ styles, value }) {
  return (
    <span
      className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
        styles[value] || 'bg-gray-100 text-gray-800'
      }`}
    >
      {value}
    </span>
  );
}

function VehicleTable({ vehicles, loading, totalCount }) {
  return (
    <div className="rounded-lg bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-800">Registered Vehicles</h2>
        {!loading && (
          <span className="text-sm text-gray-500">
            Showing {vehicles.length} of {totalCount}
          </span>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead>
            <tr className="border-b border-gray-200 text-xs uppercase text-gray-500">
              <th className="px-3 py-2">Vehicle ID</th>
              <th className="px-3 py-2">Model</th>
              <th className="px-3 py-2">Group</th>
              <th className="px-3 py-2">Registration</th>
              <th className="px-3 py-2">ECUs / Firmware</th>
              <th className="px-3 py-2">Gateway</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={6} className="px-3 py-6 text-center text-gray-500">
                  Loading...
                </td>
              </tr>
            )}
            {!loading && vehicles.length === 0 && (
              <tr>
                <td colSpan={6} className="px-3 py-6 text-center text-gray-500">
                  No vehicles match the current filters.
                </td>
              </tr>
            )}
            {!loading &&
              vehicles.map((v) => (
                <tr key={v.id} className="border-b border-gray-100 align-top hover:bg-gray-50">
                  <td className="px-3 py-2 font-medium text-gray-800">{v.id}</td>
                  <td className="px-3 py-2">{v.name}</td>
                  <td className="px-3 py-2">{v.group}</td>
                  <td className="px-3 py-2">
                    <Badge styles={REGISTRATION_STYLES} value={v.registrationStatus} />
                  </td>
                  <td className="px-3 py-2">
                    <ul className="space-y-0.5">
                      {v.ecus.map((ecu) => (
                        <li key={ecu.name} className="text-xs">
                          {ecu.name}{' '}
                          <span className="font-mono text-gray-600">v{ecu.firmwareVersion}</span>
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td className="px-3 py-2">
                    <Badge styles={GATEWAY_STYLES} value={v.gatewayStatus} />
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default VehicleTable;
