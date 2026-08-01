import { useState, useCallback } from 'react';

export const useItemForm = ({ initialValues = {}, createFn = null, onSuccess = null } = {}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState(initialValues);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState('');

  const resetForm = useCallback(() => {
    setFormData(initialValues);
    setFormError('');
  }, [initialValues]);

  const handleSubmit = useCallback(
    async (customPayload, callbackOnSuccess) => {
      setFormLoading(true);
      setFormError('');

      try {
        if (!createFn) throw new Error('createFn not provided');

        const payload = customPayload || formData;
        const res = await createFn(payload);

        if (onSuccess) onSuccess(res);
        if (callbackOnSuccess) callbackOnSuccess(res);

        resetForm();
        setShowAddForm(false);
      } catch (err) {
        const errorMsg = err.response?.data?.error || err.response?.data?.message || err.message || 'Failed to create item';
        setFormError(errorMsg);
      } finally {
        setFormLoading(false);
      }
    },
    [formData, createFn, onSuccess, resetForm]
  );

  return {
    showAddForm,
    setShowAddForm,
    formData,
    setFormData,
    formLoading,
    setFormLoading,
    formError,
    setFormError,
    resetForm,
    handleSubmit,
  };
};
