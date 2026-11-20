import { useCallback, useEffect, useState } from 'react';
import FirmwareUpload from '../components/firmware/FirmwareUpload';
import FirmwareTable from '../components/firmware/FirmwareTable';
import FirmwareDetailsModal from '../components/firmware/FirmwareDetailsModal';
import {
  getFirmwareList,
  getFirmwareById,
  uploadFirmware,
  deleteFirmware,
} from '../services/firmwareService';

function Firmware() {
  const [firmware, setFirmware] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selected, setSelected] = useState(null);

  const loadFirmware = useCallback(async () => {
    setLoading(true);
    try {
      setFirmware(await getFirmwareList());
      setError('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadFirmware();
  }, [loadFirmware]);

  // Throws on failure so FirmwareUpload can show the error inline.
  const handleUpload = async (formData) => {
    await uploadFirmware(formData);
    await loadFirmware();
  };

  const handleView = async (id) => {
    try {
      setSelected(await getFirmwareById(id));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (fw) => {
    if (!window.confirm(`Delete firmware v${fw.version} for ${fw.targetEcu}?`)) return;
    try {
      await deleteFirmware(fw.id);
      await loadFirmware();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-800">Firmware Management</h1>

      {error && (
        <div className="flex items-center justify-between rounded bg-red-50 px-4 py-2 text-sm text-red-700">
          <span>{error}</span>
          <button onClick={() => setError('')} className="font-medium">
            Dismiss
          </button>
        </div>
      )}

      <FirmwareUpload onUpload={handleUpload} />
      <FirmwareTable
        firmware={firmware}
        loading={loading}
        onView={handleView}
        onDelete={handleDelete}
      />
      <FirmwareDetailsModal firmware={selected} onClose={() => setSelected(null)} />
    </div>
  );
}

export default Firmware;