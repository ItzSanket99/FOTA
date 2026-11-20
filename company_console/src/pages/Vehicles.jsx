import { useCallback, useEffect, useMemo, useState } from 'react';
import VehicleFilters from '../components/vehicle/VehicleFilters';
import VehicleTable from '../components/vehicle/VehicleTable';
import { getVehicles } from '../services/vehicleService';
import { filterVehicles } from '../utils/vehicleUtils';

const INITIAL_FILTERS = { search: '', registration: '', gateway: '' };

function Vehicles() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState(INITIAL_FILTERS);

  const loadVehicles = useCallback(async () => {
    setLoading(true);
    try {
      setVehicles(await getVehicles());
      setError('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadVehicles();
  }, [loadVehicles]);

  const filtered = useMemo(() => filterVehicles(vehicles, filters), [vehicles, filters]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-800">Vehicle Management</h1>

      {error && <div className="rounded bg-red-50 px-4 py-2 text-sm text-red-700">{error}</div>}

      <VehicleFilters
        filters={filters}
        onChange={setFilters}
        onRefresh={loadVehicles}
        refreshing={loading}
      />
      <VehicleTable vehicles={filtered} loading={loading} totalCount={vehicles.length} />
    </div>
  );
}

export default Vehicles;