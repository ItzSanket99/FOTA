import { formatDate } from '../../utils/firmwareUtils';

function ReleaseList({ releases }) {
  return (
    <div className="rounded-lg bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-lg font-semibold text-gray-800">Releases (this session)</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead>
            <tr className="border-b border-gray-200 text-xs uppercase text-gray-500">
              <th className="px-3 py-2">Release ID</th>
              <th className="px-3 py-2">Firmware</th>
              <th className="px-3 py-2">Target ECU</th>
              <th className="px-3 py-2">Vehicles</th>
              <th className="px-3 py-2">Created</th>
              <th className="px-3 py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {releases.length === 0 && (
              <tr>
                <td colSpan={6} className="px-3 py-6 text-center text-gray-500">
                  No releases published yet.
                </td>
              </tr>
            )}
            {releases.map((r) => (
              <tr key={r.id} className="border-b border-gray-100">
                <td className="px-3 py-2 font-mono text-xs">{r.id}</td>
                <td className="px-3 py-2">v{r.version}</td>
                <td className="px-3 py-2">{r.targetEcu}</td>
                <td className="px-3 py-2">{r.vehicleIds.join(', ')}</td>
                <td className="px-3 py-2">{formatDate(r.createdAt)}</td>
                <td className="px-3 py-2">
                  <span className="rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
                    {r.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ReleaseList;