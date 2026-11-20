import { StatusBadge } from './FirmwareTable';
import { formatDate, formatFileSize } from '../../utils/firmwareUtils';

function Row({ label, children }) {
  return (
    <div className="grid grid-cols-3 gap-2 border-b border-gray-100 py-2 text-sm">
      <dt className="text-gray-500">{label}</dt>
      <dd className="col-span-2 text-gray-800">{children}</dd>
    </div>
  );
}

function FirmwareDetailsModal({ firmware, onClose }) {
  if (!firmware) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-lg bg-white p-6 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-800">Firmware Details</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
            ✕
          </button>
        </div>

        <dl>
          <Row label="Record ID">{firmware.id}</Row>
          <Row label="Version">v{firmware.version}</Row>
          <Row label="Target ECU">{firmware.targetEcu}</Row>
          <Row label="File Name">
            <span className="font-mono text-xs">{firmware.fileName}</span>
          </Row>
          <Row label="File Size">{formatFileSize(firmware.fileSize)}</Row>
          {firmware.sha256 && (
            <Row label="SHA-256">
              <span className="break-all font-mono text-xs">{firmware.sha256}</span>
            </Row>
          )}
          <Row label="Upload Date">{formatDate(firmware.uploadDate)}</Row>
          <Row label="Upload Date">{formatDate(firmware.uploadDate)}</Row>
          <Row label="Status">
            <StatusBadge status={firmware.status} />
          </Row>
          <Row label="Description">{firmware.description}</Row>
        </dl>

        <div className="mt-4 text-right">
          <button
            onClick={onClose}
            className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default FirmwareDetailsModal;