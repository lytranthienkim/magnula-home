import { renderHook, act, waitFor } from '@testing-library/react';
import { useListManagement } from '../useListManagement';

describe('useListManagement', () => {
  const mockData = [
    { id: 1, name: 'Item 1', status: 'active', createdAt: '2024-01-01' },
    { id: 2, name: 'Item 2', status: 'inactive', createdAt: '2024-01-02' },
    { id: 3, name: 'Item 3', status: 'active', createdAt: '2024-01-03' },
  ];

  const mockFetchFn = jest.fn().mockResolvedValue({ data: mockData });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch data on mount', async () => {
    const { result } = renderHook(() =>
      useListManagement({ fetchFn: mockFetchFn })
    );

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.data).toEqual(mockData);
    expect(mockFetchFn).toHaveBeenCalled();
  });

  it('should filter data correctly', async () => {
    const { result } = renderHook(() =>
      useListManagement({
        fetchFn: mockFetchFn,
        filterFn: (item, status) => item.status === status,
      })
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.filteredAndSortedData).toHaveLength(3);

    // Change filter
    act(() => {
      result.current.setStatusFilter('active');
    });

    const filtered = result.current.filteredAndSortedData;
    expect(filtered.every((item) => item.status === 'active')).toBe(true);
  });

  it('should sort data by createdAt', async () => {
    const { result } = renderHook(() =>
      useListManagement({ fetchFn: mockFetchFn })
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    const sorted = result.current.filteredAndSortedData;
    expect(sorted[0].createdAt).toBe('2024-01-03'); // newest first
    expect(sorted[sorted.length - 1].createdAt).toBe('2024-01-01'); // oldest last
  });

  it('should handle fetch error', async () => {
    const mockError = new Error('Fetch failed');
    const mockFailedFetchFn = jest.fn().mockRejectedValue(mockError);

    const { result } = renderHook(() =>
      useListManagement({ fetchFn: mockFailedFetchFn })
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe('Failed to fetch data');
    expect(result.current.data).toEqual([]);
  });

  it('should handle empty data response', async () => {
    const mockEmptyFetchFn = jest.fn().mockResolvedValue({ data: [] });

    const { result } = renderHook(() =>
      useListManagement({ fetchFn: mockEmptyFetchFn })
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.data).toEqual([]);
  });
});
