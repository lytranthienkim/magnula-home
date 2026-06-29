'use client'

import { useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AiOutlineClose } from 'react-icons/ai';
import { createProductRequest } from '@/api/order';

export const RequestForm = ({ isOpen, onClose, productId, productVariantId }) => {
    const [formData, setFormData] = useState({
        customerName: '',
        customerPhone: '',
        requestedQuantity: 1,
        description: ''
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [fieldErrors, setFieldErrors] = useState({});
    const [success, setSuccess] = useState(false);

    const handleChange = useCallback((e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'requestedQuantity' ? value : value
        }));
        if (error) setError('');
        // Clear field error when user starts typing
        if (fieldErrors[name]) {
            setFieldErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    }, [error, fieldErrors]);

    const validateForm = () => {
        const errors = {};

        if (!formData.customerName || formData.customerName.trim() === '') {
            errors.customerName = 'Full name is required';
        }

        if (!formData.customerPhone || formData.customerPhone.trim() === '') {
            errors.customerPhone = 'Phone number is required';
        }

        const quantity = parseInt(formData.requestedQuantity);
        if (isNaN(quantity) || quantity < 1) {
            errors.requestedQuantity = 'Quantity must be at least 1';
        }

        return errors;
    };

    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setFieldErrors({});

        // Validate form
        const errors = validateForm();
        if (Object.keys(errors).length > 0) {
            setFieldErrors(errors);
            setLoading(false);
            return;
        }

        try {
            await createProductRequest({
                customerName: formData.customerName.trim(),
                customerPhone: formData.customerPhone.trim(),
                requestedQuantity: parseInt(formData.requestedQuantity),
                description: formData.description.trim(),
                productId,
                productVariantId
            });

            setSuccess(true);
            setTimeout(() => {
                onClose();
                setFormData({
                    customerName: '',
                    customerPhone: '',
                    requestedQuantity: 1,
                    description: ''
                });
                setSuccess(false);
            }, 1500);
        } catch (err) {
            setError(err.message || 'An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    }, [formData, productId, productVariantId, onClose]);

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        key="backdrop"
                        className="fixed inset-0 bg-black/20 z-[1000]"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                    />

                    {/* Modal */}
                    <motion.div
                        key="modal"
                        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[90vw] md:max-w-[600px] lg:max-w-[700px] bg-background-primary z-[1001] border-[0.25px] border-[#272727] rounded-none p-4 md:p-6 lg:p-8"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    >
                        {/* Header */}
                        <div className="flex justify-between items-center mb-4 md:mb-6">
                            <h2 className="h3-neu font-display-semibold md:h2-neu">Request Quantity</h2>
                            <button
                                onClick={onClose}
                                className="hover:opacity-70 transition-opacity"
                            >
                                <AiOutlineClose size={20} />
                            </button>
                        </div>

                        
                        {error && (
                            <div className="mb-4 md:mb-6 p-3 md:p-4  border-[var(--color-error)] bg-red-50 rounded-none">
                                <p className="body-02 font-display-regular" style={{ color: 'var(--color-error)' }}>
                                    {error}
                                </p>
                            </div>
                        )}

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="flex flex-col gap-3 md:gap-4 lg:gap-5">
                            {/* Customer Name */}
                            <div className="flex flex-col gap-1 md:gap-2">
                                <label className="body-03 md:body-02 font-display-regular">Full Name (*)</label>
                                <input
                                    type="text"
                                    name="customerName"
                                    value={formData.customerName}
                                    onChange={handleChange}
                                    placeholder="Enter your full name"
                                    className={`body-03 md:body-02 font-display-regular border-[0.25px] py-2 px-3 bg-background-primary focus:outline-none rounded-none ${
                                        fieldErrors.customerName ? 'border-[var(--color-error)]' : 'border-[#272727]'
                                    }`}
                                />
                                {fieldErrors.customerName && (
                                    <p className="body-03 font-display-regular" style={{ color: 'var(--color-error)' }}>
                                        {fieldErrors.customerName}
                                    </p>
                                )}
                            </div>

                            {/* Customer Phone */}
                            <div className="flex flex-col gap-1 md:gap-2">
                                <label className="body-03 md:body-02 font-display-regular">Phone Number (*)</label>
                                <input
                                    type="tel"
                                    name="customerPhone"
                                    value={formData.customerPhone}
                                    onChange={handleChange}
                                    placeholder="Enter your phone number"
                                    className={`body-03 md:body-02 font-display-regular border-[0.25px] py-2 px-3 bg-background-primary focus:outline-none rounded-none ${
                                        fieldErrors.customerPhone ? 'border-[var(--color-error)]' : 'border-[#272727]'
                                    }`}
                                />
                                {fieldErrors.customerPhone && (
                                    <p className="body-03 font-display-regular" style={{ color: 'var(--color-error)' }}>
                                        {fieldErrors.customerPhone}
                                    </p>
                                )}
                            </div>

                            {/* Requested Quantity */}
                            <div className="flex flex-col gap-1 md:gap-2">
                                <label className="body-03 md:body-02 font-display-regular">Requested Quantity (*)</label>
                                <input
                                    type="text"
                                    name="requestedQuantity"
                                    value={formData.requestedQuantity}
                                    onChange={handleChange}
                                    placeholder="Enter quantity (e.g., 5)"
                                    className={`body-03 md:body-02 font-display-regular border-[0.25px] py-2 px-3 bg-background-primary focus:outline-none rounded-none ${
                                        fieldErrors.requestedQuantity ? 'border-[var(--color-error)]' : 'border-[#272727]'
                                    }`}
                                />
                                {fieldErrors.requestedQuantity && (
                                    <p className="body-03 font-display-regular" style={{ color: 'var(--color-error)' }}>
                                        {fieldErrors.requestedQuantity}
                                    </p>
                                )}
                            </div>

                            {/* Description */}
                            <div className="flex flex-col gap-1 md:gap-2">
                                <label className="body-03 md:body-02 font-display-regular">Description</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    placeholder="Add any special requests or notes"
                                    rows={3}
                                    className="body-03 md:body-02 font-display-regular border-[0.25px] border-[#272727] py-2 px-3 bg-background-primary focus:outline-none rounded-none resize-none"
                                />
                            </div>

                            {/* Buttons */}
                            <div className="flex flex-col md:flex-row gap-2 md:gap-3 mt-4 md:mt-6">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="flex-1 border-[0.25px] border-[#272727] body-02 md:body-02 font-display-semibold py-2 md:py-3 rounded-none cursor-pointer hover:opacity-80 transition-opacity"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading || success || !formData.customerName.trim() || !formData.customerPhone.trim()}
                                    className="flex-1 bg-black text-third body-02 md:body-02 font-display-semibold py-2 md:py-3 rounded-none cursor-pointer disabled:opacity-50 hover:opacity-90 transition-opacity"
                                >
                                    {loading ? 'Submitting...' : success ? 'Submitted' : 'Request'}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};
