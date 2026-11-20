import { formatFileSize } from '../../utils/firmwareUtils';

function ReleaseReviewModal({ review, publishing, error, onConfirm, onCancel }) {
  if (!review) return null;
  const { firmware, vehicles } = review;
  const offline = vehicles.filter((v) => v.gatewayStatus !== 'Online');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-lg rounded-lg bg-white p-6 shadow-lg">
        <h3 className="mb-4 text-lg font-semibold text-gray-800">Review Release</h3>

        <dl className="space-y-2 text-sm">
          <div className="flex justify-between">
            <dt className="text-gray-500">Target ECU</dt>
            <dd>{firmware.targetEcu}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-gray-500">Firmware version</dt>
            <dd>v{firmware.version}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-gray-500">File</dt>
            <dd className="font-mono text-xs">
              {firmware.fileName} ({formatFileSize(firmware.fileSize)})
            </dd>
          </div>
        </dl>

        <h4 className="mb-1 mt-4 text-sm font-medium text-gray-700">
          Vehicles ({vehicles.length})
        </h4>
        <ul className="max-h-40 overflow-y-auto rounded border border-gray-200 text-sm">
          {vehicles.map((v) => (
            <li key={v.id} className="flex justify-between border-b border-gray-100 px-3 py-1.5 last:border-0">
              <span>
                {v.id} · {v.name}
              </span>
              <span className="text-gray-500">
                v{v.currentVersion} → v{firmware.version}
              </span>
            </li>
          ))}
        </ul>

        {offline.length > 0 && (
          <p className="mt-3 rounded bg-yellow-50 px-3 py-2 text-xs text-yellow-800">
            {offline.length} vehicle(s) have an offline gateway ({offline.map((v) => v.id).join(', ')}).
            They will not receive the update until the gateway reconnects.
          </p>
        )}

        {error && <p className="mt-3 rounded bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

        <div className="mt-5 flex justify-end gap-3">
          <button
            onClick={onCancel}
            disabled={publishing}
            className="rounded border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={publishing}
            className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {publishing ? 'Publishing...' : 'Publish Update'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ReleaseReviewModal;