import { renderHook, act, waitFor } from '@testing-library/react';
import { useItemModal } from '../useItemModal';

describe('useItemModal', () => {
  const mockItem = { id: 1, name: 'Product 1', price: 100 };
  const mockUpdateFn = jest.fn().mockResolvedValue({ data: { ...mockItem, name: 'Updated Product' } });
  const mockDeleteFn = jest.fn().mockResolvedValue({ data: { success: true } });
  const mockOnSuccess = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize with closed modal', () => {
    const { result } = renderHook(() =>
      useItemModal({
        updateFn: mockUpdateFn,
        onSuccess: mockOnSuccess,
      })
    );

    expect(result.current.showModal).toBe(false);
    expect(result.current.editData).toBe(null);
    expect(result.current.editMode).toBe(false);
  });

  it('should open modal for viewing/editing item', () => {
    const { result } = renderHook(() =>
      useItemModal({
        updateFn: mockUpdateFn,
        onSuccess: mockOnSuccess,
      })
    );

    act(() => {
      result.current.openModal(mockItem);
    });

    expect(result.current.showModal).toBe(true);
    expect(result.current.editData).toEqual(mockItem);
    expect(result.current.editMode).toBe(true);
  });

  it('should update edit data', () => {
    const { result } = renderHook(() =>
      useItemModal({
        updateFn: mockUpdateFn,
        onSuccess: mockOnSuccess,
      })
    );

    act(() => {
      result.current.openModal(mockItem);
    });

    act(() => {
      result.current.setEditData({ ...mockItem, name: 'Updated' });
    });

    expect(result.current.editData.name).toBe('Updated');
  });

  it('should save changes', async () => {
    const { result } = renderHook(() =>
      useItemModal({
        updateFn: mockUpdateFn,
        onSuccess: mockOnSuccess,
      })
    );

    act(() => {
      result.current.openModal(mockItem);
      result.current.setEditData({ ...mockItem, name: 'Updated Product' });
    });

    act(() => {
      result.current.handleSave();
    });

    expect(result.current.saving).toBe(true);

    await waitFor(() => {
      expect(result.current.saving).toBe(false);
    });

    expect(mockUpdateFn).toHaveBeenCalledWith(mockItem.id, { ...mockItem, name: 'Updated Product' });
    expect(mockOnSuccess).toHaveBeenCalled();
    expect(result.current.showModal).toBe(false);
  });

  it('should close modal', () => {
    const { result } = renderHook(() =>
      useItemModal({
        updateFn: mockUpdateFn,
        onSuccess: mockOnSuccess,
      })
    );

    act(() => {
      result.current.openModal(mockItem);
    });

    act(() => {
      result.current.closeModal();
    });

    expect(result.current.showModal).toBe(false);
    expect(result.current.editData).toBe(null);
    expect(result.current.editMode).toBe(false);
  });

  it('should handle update error', async () => {
    const mockFailedUpdateFn = jest.fn().mockRejectedValue({
      response: { data: { message: 'Update failed' } },
    });

    const { result } = renderHook(() =>
      useItemModal({
        updateFn: mockFailedUpdateFn,
        onSuccess: mockOnSuccess,
      })
    );

    act(() => {
      result.current.openModal(mockItem);
      result.current.setEditData({ ...mockItem, name: 'Updated' });
    });

    act(() => {
      result.current.handleSave();
    });

    await waitFor(() => {
      expect(result.current.saving).toBe(false);
    });

    expect(result.current.error).toBe('Update failed');
    expect(result.current.showModal).toBe(true); // Modal stays open on error
  });

  it('should delete item if deleteFn provided', async () => {
    const { result } = renderHook(() =>
      useItemModal({
        updateFn: mockUpdateFn,
        deleteFn: mockDeleteFn,
        onSuccess: mockOnSuccess,
      })
    );

    act(() => {
      result.current.openModal(mockItem);
    });

    act(() => {
      result.current.handleDelete();
    });

    await waitFor(() => {
      expect(result.current.deleting).toBe(false);
    });

    expect(mockDeleteFn).toHaveBeenCalledWith(mockItem.id);
    expect(mockOnSuccess).toHaveBeenCalled();
    expect(result.current.showModal).toBe(false);
  });

  it('should handle delete error', async () => {
    const mockFailedDeleteFn = jest.fn().mockRejectedValue({
      response: { data: { message: 'Delete failed' } },
    });

    const { result } = renderHook(() =>
      useItemModal({
        updateFn: mockUpdateFn,
        deleteFn: mockFailedDeleteFn,
        onSuccess: mockOnSuccess,
      })
    );

    act(() => {
      result.current.openModal(mockItem);
    });

    act(() => {
      result.current.handleDelete();
    });

    await waitFor(() => {
      expect(result.current.deleting).toBe(false);
    });

    expect(result.current.error).toBe('Delete failed');
    expect(result.current.showModal).toBe(true); // Modal stays open on error
  });
});
