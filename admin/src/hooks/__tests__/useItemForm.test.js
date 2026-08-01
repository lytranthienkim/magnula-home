import { renderHook, act, waitFor } from '@testing-library/react';
import { useItemForm } from '../useItemForm';

describe('useItemForm', () => {
  const initialValues = { name: '', email: '' };
  const mockCreateFn = jest.fn().mockResolvedValue({ data: { id: 1, name: 'Test', email: 'test@example.com' } });
  const mockOnSuccess = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize form with default values', () => {
    const { result } = renderHook(() =>
      useItemForm({
        initialValues,
        createFn: mockCreateFn,
        onSuccess: mockOnSuccess,
      })
    );

    expect(result.current.formData).toEqual(initialValues);
    expect(result.current.showForm).toBe(false);
    expect(result.current.submitting).toBe(false);
  });

  it('should open form', () => {
    const { result } = renderHook(() =>
      useItemForm({
        initialValues,
        createFn: mockCreateFn,
        onSuccess: mockOnSuccess,
      })
    );

    act(() => {
      result.current.openForm();
    });

    expect(result.current.showForm).toBe(true);
  });

  it('should update form data', () => {
    const { result } = renderHook(() =>
      useItemForm({
        initialValues,
        createFn: mockCreateFn,
        onSuccess: mockOnSuccess,
      })
    );

    act(() => {
      result.current.setFormData({ name: 'John', email: 'john@example.com' });
    });

    expect(result.current.formData).toEqual({ name: 'John', email: 'john@example.com' });
  });

  it('should reset form to initial values', () => {
    const { result } = renderHook(() =>
      useItemForm({
        initialValues,
        createFn: mockCreateFn,
        onSuccess: mockOnSuccess,
      })
    );

    act(() => {
      result.current.setFormData({ name: 'John', email: 'john@example.com' });
    });

    act(() => {
      result.current.resetForm();
    });

    expect(result.current.formData).toEqual(initialValues);
    expect(result.current.formError).toBe('');
  });

  it('should submit form with validation', async () => {
    const { result } = renderHook(() =>
      useItemForm({
        initialValues,
        createFn: mockCreateFn,
        onSuccess: mockOnSuccess,
      })
    );

    act(() => {
      result.current.openForm();
      result.current.setFormData({ name: 'John', email: 'john@example.com' });
    });

    act(() => {
      result.current.handleSubmit();
    });

    expect(result.current.submitting).toBe(true);

    await waitFor(() => {
      expect(result.current.submitting).toBe(false);
    });

    expect(mockCreateFn).toHaveBeenCalledWith({ name: 'John', email: 'john@example.com' });
    expect(mockOnSuccess).toHaveBeenCalled();
    expect(result.current.showForm).toBe(false);
  });

  it('should close form and reset on successful submission', async () => {
    const { result } = renderHook(() =>
      useItemForm({
        initialValues,
        createFn: mockCreateFn,
        onSuccess: mockOnSuccess,
      })
    );

    act(() => {
      result.current.openForm();
      result.current.setFormData({ name: 'John', email: 'john@example.com' });
    });

    act(() => {
      result.current.handleSubmit();
    });

    await waitFor(() => {
      expect(result.current.submitting).toBe(false);
    });

    expect(result.current.showForm).toBe(false);
    expect(result.current.formData).toEqual(initialValues);
  });

  it('should handle submission error', async () => {
    const mockError = new Error('Creation failed');
    const mockFailedCreateFn = jest.fn().mockRejectedValue({
      response: { data: { message: 'Invalid data' } },
    });

    const { result } = renderHook(() =>
      useItemForm({
        initialValues,
        createFn: mockFailedCreateFn,
        onSuccess: mockOnSuccess,
      })
    );

    act(() => {
      result.current.openForm();
      result.current.setFormData({ name: 'John', email: 'john@example.com' });
    });

    act(() => {
      result.current.handleSubmit();
    });

    await waitFor(() => {
      expect(result.current.submitting).toBe(false);
    });

    expect(result.current.formError).toBe('Invalid data');
    expect(result.current.showForm).toBe(true); // Form stays open on error
  });

  it('should close form without submission', () => {
    const { result } = renderHook(() =>
      useItemForm({
        initialValues,
        createFn: mockCreateFn,
        onSuccess: mockOnSuccess,
      })
    );

    act(() => {
      result.current.openForm();
      result.current.setFormData({ name: 'John', email: 'john@example.com' });
    });

    act(() => {
      result.current.closeForm();
    });

    expect(result.current.showForm).toBe(false);
    expect(result.current.formData).toEqual(initialValues);
  });
});
