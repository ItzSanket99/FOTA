import { useCallback, useEffect, useState } from 'react';
import ReleaseForm from '../components/release/ReleaseForm';
import ReleaseReviewModal from '../components/release/ReleaseReviewModal';
import ReleaseList from '../components/release/ReleaseList';
import { getFirmwareList } from '../services/firmwareService';
import { getVehicles } from '../services/vehicleService';
import { getReleases, createRelease } from '../services/releaseService';

function Release() {
  const [firmware, setFirmware] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [releases, setReleases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [review, setReview] = useState(null);
  const [publishing, setPublishing] = useState(false);
  const [publishError, setPublishError] = useState('');
  const [formKey, setFormKey] = useState(0); // remount form to reset it

  const loadAll = useCallback(async () => {
    try {
      const [fw, veh, rel] = await Promise.all([
        getFirmwareList(),
        getVehicles(),
        getReleases(),
      ]);
      setFirmware(fw);
      setVehicles(veh);
      setReleases(rel);
      setError('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  const handleConfirm = async () => {
    setPublishing(true);
    setPublishError('');
    try {
      const release = await createRelease({
        firmwareId: review.firmware.id,
        vehicleIds: review.vehicles.map((v) => v.id),
      });
      const failed = release.failedVehicleIds || [];
      setSuccess(
        `Release published: ${release.targetEcu} v${release.version} to ${
          release.vehicleIds.length - failed.length
        } vehicle(s).` +
          (failed.length ? ` Notification failed for: ${failed.join(', ')}.` : '')
      );
      setReview(null);
      setFormKey((k) => k + 1);
      await loadAll();
    } catch (err) {
      setPublishError(err.message);
    } finally {
      setPublishing(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-800">Firmware Release</h1>

      {error && <div className="rounded bg-red-50 px-4 py-2 text-sm text-red-700">{error}</div>}
      {success && (
        <div className="flex items-center justify-between rounded bg-green-50 px-4 py-2 text-sm text-green-700">
          <span>{success}</span>
          <button onClick={() => setSuccess('')} className="font-medium">
            Dismiss
          </button>
        </div>
      )}

      {loading ? (
        <p className="text-sm text-gray-500">Loading...</p>
      ) : (
        <>
          <ReleaseForm
            key={formKey}
            firmware={firmware}
            vehicles={vehicles}
            onReview={(data) => {
              setSuccess('');
              setPublishError('');
              setReview(data);
            }}
          />
          <ReleaseList releases={releases} />
        </>
      )}

      <ReleaseReviewModal
        review={review}
        publishing={publishing}
        error={publishError}
        onConfirm={handleConfirm}
        onCancel={() => setReview(null)}
      />
    </div>
  );
}

export default Release;