'use client';

import { useEffect, useState } from 'react';
import { PermissionsHeader } from '@/components/layout/permissions';

export default function PermissionsPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setData([]);
      } catch (err) {
        setError('Failed to load permissions');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <PermissionsHeader />

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded">
          <p className="text-xs text-red-600">{error}</p>
        </div>
      )}

      <div className="bg-white rounded-lg  p-8">
        <p className="text-sm text-gray-600">
          {loading ? 'Loading...' : data.length === 0 ? 'No permissions available' : `${data.length} permissions`}
        </p>
      </div>
    </div>
  );
}
