import { useEffect, useState, useCallback, useMemo } from 'react';

export const useListManagement = ({ fetchFn, filterKey = 'isActive', sortField = 'createdAt', filterFn = null } = {}) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortOrder, setSortOrder] = useState('newest');

  const fetchItems = useCallback(async () => {
    try {
      if (!fetchFn) throw new Error('fetchFn not provided');
      const res = await fetchFn();
      setItems(res.data || []);
    } catch (err) {
      console.error('Error loading items:', err);
      setError('Failed to load items');
    } finally {
      setLoading(false);
    }
  }, [fetchFn]);

  useEffect(() => {
    fetchItems();
  }, []);

  const filteredAndSortedItems = useMemo(
    () => {
      let result = items || [];

      if (statusFilter !== 'All') {
        if (filterFn) {
          result = result.filter((item) => filterFn(item, statusFilter));
        } else {
          result = result.filter((item) => item[filterKey] === (statusFilter === 'active'));
        }
      }

      result = result.sort((a, b) => {
        const dateA = new Date(a[sortField]).getTime();
        const dateB = new Date(b[sortField]).getTime();
        return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
      });

      return result;
    },
    [items, statusFilter, sortOrder, filterKey, sortField, filterFn]
  );

  return {
    items,
    setItems,
    loading,
    error,
    setError: useCallback((err) => {}, []),
    statusFilter,
    setStatusFilter,
    sortOrder,
    setSortOrder,
    displayData: filteredAndSortedItems,
    fetchItems,
  };
};
