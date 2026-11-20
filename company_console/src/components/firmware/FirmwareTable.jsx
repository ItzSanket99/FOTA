import { FIRMWARE_STATUS } from '../../data/mockFirmware';
import { formatDate } from '../../utils/firmwareUtils';

const STATUS_STYLES = {
  [FIRMWARE_STATUS.UPLOADED]: 'bg-blue-100 text-blue-800',
  [FIRMWARE_STATUS.RELEASED]: 'bg-green-100 text-green-800',
};

export function StatusBadge({ status }) {
  return (
    <span
      className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
        STATUS_STYLES[status] || 'bg-gray-100 text-gray-800'
      }`}
    >
      {status}
    </span>
  );
}

function FirmwareTable({ firmware, loading, onView, onDelete }) {
  return (
    <div className="rounded-lg bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-lg font-semibold text-gray-800">Firmware Records</h2>

      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead>
            <tr className="border-b border-gray-200 text-xs uppercase text-gray-500">
              <th className="px-3 py-2">Version</th>
              <th className="px-3 py-2">Target ECU</th>
              <th className="px-3 py-2">File Name</th>
              <th className="px-3 py-2">Upload Date</th>
              <th className="px-3 py-2">Status</th>
              <th className="px-3 py-2 text-right">Actions</th>
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
            {!loading && firmware.length === 0 && (
              <tr>
                <td colSpan={6} className="px-3 py-6 text-center text-gray-500">
                  No firmware uploaded yet.
                </td>
              </tr>
            )}
            {!loading &&
              firmware.map((fw) => {
                const released = fw.status === FIRMWARE_STATUS.RELEASED;
                return (
                  <tr key={fw.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-3 py-2 font-medium text-gray-800">v{fw.version}</td>
                    <td className="px-3 py-2">{fw.targetEcu}</td>
                    <td className="px-3 py-2 font-mono text-xs">{fw.fileName}</td>
                    <td className="px-3 py-2">{formatDate(fw.uploadDate)}</td>
                    <td className="px-3 py-2">
                      <StatusBadge status={fw.status} />
                    </td>
                    <td className="space-x-3 px-3 py-2 text-right">
                      <button
                        onClick={() => onView(fw.id)}
                        className="text-blue-600 hover:underline"
                      >
                        View
                      </button>
                      <button
                        onClick={() => onDelete(fw)}
                        disabled={released}
                        title={released ? 'Released firmware cannot be deleted' : 'Delete'}
                        className="text-red-600 hover:underline disabled:cursor-not-allowed disabled:text-gray-300 disabled:no-underline"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default FirmwareTable;