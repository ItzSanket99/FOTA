import { REGISTRATION_OPTIONS, GATEWAY_OPTIONS } from '../../utils/vehicleUtils';

const controlClass =
  'rounded border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500';

function VehicleFilters({ filters, onChange, onRefresh, refreshing }) {
  const set = (key) => (e) => onChange({ ...filters, [key]: e.target.value });
  const hasFilters = filters.search || filters.registration || filters.gateway;

  return (
    <div className="flex flex-wrap items-center gap-3">
      <input
        type="text"
        value={filters.search}
        onChange={set('search')}
        placeholder="Search vehicle ID or model"
        className={`${controlClass} w-64`}
      />
      <select value={filters.registration} onChange={set('registration')} className={controlClass}>
        <option value="">All registrations</option>
        {REGISTRATION_OPTIONS.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
      <select value={filters.gateway} onChange={set('gateway')} className={controlClass}>
        <option value="">All gateways</option>
        {GATEWAY_OPTIONS.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
      {hasFilters && (
        <button
          onClick={() => onChange({ search: '', registration: '', gateway: '' })}
          className="text-sm text-blue-600 hover:underline"
        >
          Clear filters
        </button>
      )}
      <button
        onClick={onRefresh}
        disabled={refreshing}
        className="ml-auto rounded border border-gray-300 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-60"
      >
        {refreshing ? 'Refreshing...' : 'Refresh'}
      </button>
    </div>
  );
}

export default VehicleFilters;