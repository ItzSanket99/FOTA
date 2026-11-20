export const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2 MB, adjust to your STM32 flash partition size
const VERSION_REGEX = /^\d+\.\d+\.\d+$/;

export function validateFirmwareForm({ file, version, targetEcu, description }) {
  const errors = {};

  if (!file) {
    errors.file = 'Firmware file is required.';
  } else if (!file.name.toLowerCase().endsWith('.bin')) {
    errors.file = 'Only .bin files are allowed.';
  } else if (file.size === 0) {
    errors.file = 'File is empty.';
  } else if (file.size > MAX_FILE_SIZE) {
    errors.file = `File exceeds ${formatFileSize(MAX_FILE_SIZE)} limit.`;
  }

  if (!version.trim()) {
    errors.version = 'Version is required.';
  } else if (!VERSION_REGEX.test(version.trim())) {
    errors.version = 'Use format MAJOR.MINOR.PATCH (e.g. 1.2.0).';
  }

  if (!targetEcu) errors.targetEcu = 'Select a target ECU.';

  if (!description.trim()) {
    errors.description = 'Description is required.';
  } else if (description.trim().length > 300) {
    errors.description = 'Description must be 300 characters or fewer.';
  }

  return errors;
}

export function formatFileSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export function formatDate(iso) {
  return new Date(iso).toLocaleString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}