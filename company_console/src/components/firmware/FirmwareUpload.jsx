import { useRef, useState } from 'react';
import { ECU_OPTIONS } from '../../data/mockFirmware';
import { validateFirmwareForm, formatFileSize } from '../../utils/firmwareUtils';

const INITIAL_FORM = { version: '', targetEcu: '', description: '', file: null };

const inputClass = (hasError) =>
  `w-full rounded border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
    hasError ? 'border-red-400' : 'border-gray-300'
  }`;

function FirmwareUpload({ onUpload }) {
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState('');
  const fileRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined, form: undefined }));
    setSuccess('');
  };

  const handleFile = (e) => {
    const file = e.target.files[0] || null;
    setForm((prev) => ({ ...prev, file }));
    setErrors((prev) => ({ ...prev, file: undefined, form: undefined }));
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateFirmwareForm(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setSubmitting(true);
    try {
      await onUpload(form);
      setSuccess(`Firmware v${form.version.trim()} uploaded for ${form.targetEcu}.`);
      setForm(INITIAL_FORM);
      setErrors({});
      if (fileRef.current) fileRef.current.value = '';
    } catch (err) {
      setErrors({ form: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-lg bg-white p-6 shadow-sm" noValidate>
      <h2 className="mb-4 text-lg font-semibold text-gray-800">Upload Firmware</h2>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Target ECU</label>
          <select
            name="targetEcu"
            value={form.targetEcu}
            onChange={handleChange}
            className={inputClass(errors.targetEcu)}
          >
            <option value="">Select ECU</option>
            {ECU_OPTIONS.map((ecu) => (
              <option key={ecu} value={ecu}>
                {ecu}
              </option>
            ))}
          </select>
          {errors.targetEcu && <p className="mt-1 text-xs text-red-600">{errors.targetEcu}</p>}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Firmware Version</label>
          <input
            type="text"
            name="version"
            value={form.version}
            onChange={handleChange}
            placeholder="e.g. 1.2.0"
            className={inputClass(errors.version)}
          />
          {errors.version && <p className="mt-1 text-xs text-red-600">{errors.version}</p>}
        </div>

        <div className="md:col-span-2">
          <label className="mb-1 block text-sm font-medium text-gray-700">Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={3}
            className={inputClass(errors.description)}
          />
          {errors.description && (
            <p className="mt-1 text-xs text-red-600">{errors.description}</p>
          )}
        </div>

        <div className="md:col-span-2">
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Firmware File (.bin)
          </label>
          <input
            ref={fileRef}
            type="file"
            accept=".bin"
            onChange={handleFile}
            className={`${inputClass(errors.file)} bg-white file:mr-3 file:rounded file:border-0 file:bg-gray-100 file:px-3 file:py-1 file:text-sm`}
          />
          {form.file && (
            <p className="mt-1 text-xs text-gray-600">
              Selected: <span className="font-medium">{form.file.name}</span> (
              {formatFileSize(form.file.size)})
            </p>
          )}
          {errors.file && <p className="mt-1 text-xs text-red-600">{errors.file}</p>}
        </div>
      </div>

      {errors.form && (
        <p className="mt-4 rounded bg-red-50 px-3 py-2 text-sm text-red-700">{errors.form}</p>
      )}
      {success && (
        <p className="mt-4 rounded bg-green-50 px-3 py-2 text-sm text-green-700">{success}</p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="mt-4 rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {submitting ? 'Uploading...' : 'Upload Firmware'}
      </button>
    </form>
  );
}

export default FirmwareUpload;