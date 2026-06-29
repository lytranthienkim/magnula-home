'use client'

import { useState, useEffect, useRef, useCallback } from 'react';
import { getAllPaymentMethods } from '@/api/paymentMethod';
import { getAllCountries, getAllStateByCountry } from '@/api/country';
import { SkeletonText } from '@/components/skeleton';
import { validateShippingAddress } from '@/helper/addressValidation';
import { searchAddresses } from '@/helper/mapboxGeocoding';

// Custom Select Component tương tự Filter.jsx
const CustomSelectField = ({ label, options = [], selectedValue, onSelect, placeholder = "---", disabled = false, optionKey = 'name', optionLabel = 'name' }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const optionsArray = Array.isArray(options) ? options : [];
    const currentOption = optionsArray.find(opt => String(opt[optionKey]) === String(selectedValue));
    const displayText = currentOption ? currentOption[optionLabel] : placeholder;

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="flex flex-col gap-2 w-full" ref={dropdownRef}>
            <label className="font-display-regular body-02">{label}</label>
            <div className="relative">
                {/* Thanh hiển thị chính */}
                <button
                    type="button"
                    onClick={() => !disabled && setIsOpen(!isOpen)}
                    disabled={disabled}
                    className="w-full text-left body-02 font-display-regular
                               border-[0.25px] border-[#272727] py-2 px-3 bg-background-primary
                               focus:outline-none rounded-none flex justify-between items-center
                               disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <span className="truncate pr-4">{displayText}</span>
                </button>

                {isOpen && !disabled && (
                    <div className="absolute z-[9999] left-0 w-full mt-[-1px] bg-background-primary
                                    border-[0.25px] border-[#272727] rounded-none max-h-48 overflow-y-auto">
                        {/* Option mặc định rỗng */}
                        <button
                            type="button"
                            onClick={() => {
                                onSelect('');
                                setIsOpen(false);
                            }}
                            className="w-full text-left py-2 px-3 body-02 font-display-regular transition-colors cursor-pointer"
                        >
                            {placeholder}
                        </button>
                        {optionsArray.map((opt) => (
                            <button
                                key={opt[optionKey]}
                                type="button"
                                onClick={() => {
                                    onSelect(opt[optionKey]);
                                    setIsOpen(false);
                                }}
                                className={`w-full text-left py-2 px-3 body-02 font-display-regular cursor-pointer hover:bg-black hover:text-third duration-100
                                           ${String(selectedValue) === String(opt[optionKey])
                                        ? 'bg-[#000000] text-third cursor-pointer'
                                        : 'text-primary cursor-pointer'}`}
                            >
                                {opt[optionLabel]}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export const CheckoutForm = ({ onSubmit, isLoading, error, cartItems = [] }) => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        countryRegion: '',
        countryCode: '',
        stateProvince: '',
        shippingAddress: '',
        paymentMethodId: null,
    });

    const [errors, setErrors] = useState({});
    const [paymentMethods, setPaymentMethods] = useState([]);
    const [loadingPayments, setLoadingPayments] = useState(true);
    const [countries, setCountries] = useState([]);
    const [states, setStates] = useState([]);
    const [loadingCountries, setLoadingCountries] = useState(true);

    // Address autocomplete states
    const [addressSuggestions, setAddressSuggestions] = useState([]);
    const [showAddressSuggestions, setShowAddressSuggestions] = useState(false);
    const [loadingAddresses, setLoadingAddresses] = useState(false);

    // Fetch countries
    useEffect(() => {
        const fetchCountries = async () => {
            try {
                const data = await getAllCountries();
                setCountries(data);
            } catch (err) {
                console.error('Failed to fetch countries:', err);
            } finally {
                setLoadingCountries(false);
            }
        };
        fetchCountries();
    }, []);

    // Fetch payment methods
    useEffect(() => {
        const fetchPaymentMethods = async () => {
            try {
                const data = await getAllPaymentMethods();
                setPaymentMethods(data.data);
            } catch (err) {
                console.error('Failed to fetch payment methods:', err);
            } finally {
                setLoadingPayments(false);
            }
        };
        fetchPaymentMethods();
    }, []);

    const handleChange = useCallback((e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    }, [errors]);

    const handleCountryChange = async (e) => {
        const countryName = e.target.value;
        const country = countries.find(c => c.name === countryName);

        setFormData(prev => ({
            ...prev,
            countryRegion: countryName,
            countryCode: country?.iso2?.toLowerCase() || '',
            stateProvince: ''
        }));
        setStates([]);

        if (countryName) {
            try {
                if (country) {
                    const statesData = await getAllStateByCountry(country.iso2);
                    setStates(statesData);
                }
            } catch (err) {
                console.error('Failed to fetch states:', err);
            }
        }
    };

    const handleAddressInputChange = async (e) => {
        const value = e.target.value;
        setFormData(prev => ({
            ...prev,
            shippingAddress: value
        }));

        if (errors.shippingAddress) {
            setErrors(prev => ({
                ...prev,
                shippingAddress: ''
            }));
        }

        // Show suggestions if input is long enough
        if (value.trim().length >= 3) {
            setLoadingAddresses(true);
            setShowAddressSuggestions(true);

            try {
                // Use country code from API (already in formData)
                const countryCode = formData.countryCode || null;

                // Search addresses
                const suggestions = await searchAddresses(value, countryCode);
                setAddressSuggestions(suggestions);
            } catch (error) {
                console.error('Error fetching suggestions:', error);
                setAddressSuggestions([]);
            } finally {
                setLoadingAddresses(false);
            }
        } else {
            setAddressSuggestions([]);
            setShowAddressSuggestions(false);
        }
    };

    const handleSelectAddress = (address) => {
        setFormData(prev => ({
            ...prev,
            shippingAddress: address
        }));
        setShowAddressSuggestions(false);
        setAddressSuggestions([]);
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
        if (!formData.email.trim()) newErrors.email = 'Email is required';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email';
        if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
        if (!formData.countryRegion.trim()) newErrors.countryRegion = 'Country/Region is required';
        if (!formData.stateProvince.trim()) newErrors.stateProvince = 'State/Province is required';

        // Validate shipping address
        if (!formData.shippingAddress.trim()) {
            newErrors.shippingAddress = 'Shipping address is required';
        } else {
            const addressValidation = validateShippingAddress(formData.shippingAddress);
            if (!addressValidation.valid) {
                newErrors.shippingAddress = addressValidation.error;
            }
        }

        if (!formData.paymentMethodId) newErrors.paymentMethodId = 'Payment method is required';

        // Validate stock for all cart items
        const stockIssues = cartItems.filter(item => item.quantity > item.stock);
        if (stockIssues.length > 0) {
            const itemNames = stockIssues.map(item => item.name).join(', ');
            newErrors.stock = `Insufficient stock for: ${itemNames}. Please adjust quantities.`;
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = useCallback((e) => {
        e.preventDefault();
        if (validateForm()) {
            onSubmit(formData);
        }
    }, [formData, onSubmit]);

    if (loadingCountries || loadingPayments) {
        return (
            <div className="flex flex-col gap-6">
                <SkeletonText lines={1} height="h-8" width="w-1/3" />
                <SkeletonText lines={1} height="h-4" width="w-full" />
                <SkeletonText lines={1} height="h-10" width="w-full" />
                <SkeletonText lines={1} height="h-4" width="w-full" />
                <SkeletonText lines={8} height="h-10" width="w-full" className="gap-3" />
                <SkeletonText lines={1} height="h-12" width="w-full" />
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <h1 className='h1-neu font-display-regular'>Review & Purchase</h1>
            {/* API Error Message */}
            {error && (
                <div className=" border-[var(--color-error)] p-4 rounded" style={{ borderLeftColor: 'var(--color-error)' }}>
                    <p className="body-02 font-display-regular" style={{ color: 'var(--color-error)' }}>
                        {error}
                    </p>
                </div>
            )}
            {/* Stock Validation Error */}
            {errors.stock && (
                <div className=" border-[var(--color-error)] p-4 rounded" style={{ borderLeftColor: 'var(--color-error)' }}>
                    <p className="body-02 font-display-regular" style={{ color: 'var(--color-error)' }}>
                        {errors.stock}
                    </p>
                </div>
            )}

            {/* CONTACT SECTION */}
            <div className="flex flex-col gap-2">
                <h2 className="font-display-semibold body-01 uppercase">Contact</h2>

                
                <div className="flex flex-col gap-2">
                    <label className="font-display-regular body-02">Email (*)</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="body-02 font-display-regular border-[0.25px] border-[#272727] py-2 px-3 bg-background-primary focus:outline-none rounded-none"
                        placeholder="Enter your email"
                    />
                    {errors.email && <span className="body-03 font-display-regular" style={{ color: 'var(--color-error)' }}>{errors.email}</span>}
                </div>

                {/* Full Name & Phone - 1 Row */}
                <div className="grid grid-cols-2 gap-4">
                    {/* Full Name */}
                    <div className="flex flex-col gap-2">
                        <label className="font-display-regular body-02">Full Name (*)</label>
                        <input
                            type="text"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                            className="body-02 font-display-regular border-[0.25px] border-[#272727] py-2 px-3 bg-background-primary focus:outline-none rounded-none"
                            placeholder="Enter your full name"
                        />
                        {errors.fullName && <span className="body-03 font-display-regular" style={{ color: 'var(--color-error)' }}>{errors.fullName}</span>}
                    </div>

                    {/* Phone */}
                    <div className="flex flex-col gap-2">
                        <label className="font-display-regular body-02">Phone (*)</label>
                        <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className="body-02 font-display-regular border-[0.25px] border-[#272727] py-2 px-3 bg-background-primary focus:outline-none rounded-none"
                            placeholder="Enter your phone number"
                        />
                        {errors.phone && <span className="body-03 font-display-regular" style={{ color: 'var(--color-error)' }}>{errors.phone}</span>}
                    </div>
                </div>
            </div>

            {/* DELIVERY SECTION */}
            <div className="flex flex-col gap-4">
                <p className="font-display-semibold body-02 uppercase">Delivery</p>

                {/* Country/Region & State/Province - 1 Row */}
                <div className="grid grid-cols-2 gap-4">
                    {/* Country/Region */}
                    <div className="flex flex-col gap-2">
                        <CustomSelectField
                            label="Country/Region (*)"
                            options={countries}
                            selectedValue={formData.countryRegion}
                            onSelect={async (value) => {
                                const country = countries.find(c => c.name === value);
                                setFormData(prev => ({
                                    ...prev,
                                    countryRegion: value,
                                    countryCode: country?.iso2?.toLowerCase() || '',
                                    stateProvince: ''
                                }));
                                setStates([]);
                                if (errors.countryRegion) {
                                    setErrors(prev => ({
                                        ...prev,
                                        countryRegion: ''
                                    }));
                                }

                                if (value) {
                                    try {
                                        if (country) {
                                            const statesData = await getAllStateByCountry(country.iso2);
                                            setStates(statesData);
                                        }
                                    } catch (err) {
                                        console.error('Failed to fetch states:', err);
                                    }
                                }
                            }}
                            placeholder="---"
                            optionKey="name"
                            optionLabel="name"
                        />
                        {errors.countryRegion && <span className="body-03 font-display-regular" style={{ color: 'var(--color-error)' }}>{errors.countryRegion}</span>}
                    </div>

                    {/* State/Province */}
                    <div className="flex flex-col gap-2">
                        <CustomSelectField
                            label="State/Province (*)"
                            options={states}
                            selectedValue={formData.stateProvince}
                            onSelect={(value) => {
                                setFormData(prev => ({
                                    ...prev,
                                    stateProvince: value
                                }));
                                if (errors.stateProvince) {
                                    setErrors(prev => ({
                                        ...prev,
                                        stateProvince: ''
                                    }));
                                }
                            }}
                            placeholder="---"
                            disabled={!formData.countryRegion || states.length === 0}
                            optionKey="name"
                            optionLabel="name"
                        />
                        {errors.stateProvince && <span className="body-03 font-display-regular" style={{ color: 'var(--color-error)' }}>{errors.stateProvince}</span>}
                    </div>
                </div>

                {/* Shipping Address with Autocomplete */}
                <div className="flex flex-col gap-2 relative">
                    <label className="font-display-regular body-02">Shipping Address (*)</label>
                    <input
                        type="text"
                        name="shippingAddress"
                        value={formData.shippingAddress}
                        onChange={handleAddressInputChange}
                        onFocus={() => formData.shippingAddress.length >= 3 && setShowAddressSuggestions(true)}
                        onBlur={() => setTimeout(() => setShowAddressSuggestions(false), 200)}
                        className={`body-02 font-display-regular border-[0.25px] py-2 px-3 bg-background-primary focus:outline-none rounded-none ${
                            errors.shippingAddress ? 'border-[#dc2626]' : 'border-[#272727]'
                        }`}
                        placeholder="Type your address if it not display"
                        autoComplete="off"
                    />

                    {/* Address Suggestions Dropdown */}
                    {showAddressSuggestions && (
                        <div className="absolute top-full left-0 right-0 mt-1 bg-background-primary border-[0.25px] border-[#272727] z-[1000] max-h-48 overflow-y-auto rounded-none">
                            {loadingAddresses ? (
                                <div className="p-3 text-center body-03 text-gray-500">
                                    Loading suggestions...
                                </div>
                            ) : addressSuggestions.length > 0 ? (
                                addressSuggestions.map((suggestion, index) => (
                                    <button
                                        key={index}
                                        type="button"
                                        onClick={() => handleSelectAddress(suggestion.address)}
                                        className="w-full text-left px-3 py-2 body-02 font-display-regular border-b-[0.25px] border-[#272727]/50 last:border-b-0 hover:bg-black hover:text-third cursor-pointer transition-colors"
                                    >
                                        {suggestion.address}
                                    </button>
                                ))
                            ) : (
                                <div className="p-3 text-center body-03 text-gray-500">
                                    No addresses found
                                </div>
                            )}
                        </div>
                    )}

                    {errors.shippingAddress && <span className="body-03 font-display-regular" style={{ color: 'var(--color-error)' }}>{errors.shippingAddress}</span>}
                </div>
            </div>

            {/* PAYMENT METHOD SECTION */}
            <div className="flex flex-col gap-4">
                <h2 className="font-display-semibold body-01">Payment Method</h2>

                {loadingPayments ? (
                    <p className="body-02 font-display-regular">Loading payment methods...</p>
                ) : paymentMethods.length === 0 ? (
                    <p className="body-02 font-display-regular text-gray-500">No payment methods available</p>
                ) : (
                    <div className="flex flex-col gap-3">
                        {paymentMethods.map((method) => (
                            <label
                                key={method.id}
                                className="flex items-center gap-3 p-3 border-[0.25px] border-[#272727] cursor-pointer"
                            >
                                <input
                                    type="radio"
                                    name="paymentMethodId"
                                    value={method.id}
                                    checked={formData.paymentMethodId === method.id}
                                    onChange={(e) => {
                                        setFormData(prev => ({
                                            ...prev,
                                            paymentMethodId: parseInt(e.target.value)
                                        }));
                                        if (errors.paymentMethodId) {
                                            setErrors(prev => ({
                                                ...prev,
                                                paymentMethodId: ''
                                            }));
                                        }
                                    }}
                                    className="w-4 h-4 cursor-pointer accent-black"
                                />
                                <div className="flex flex-col gap-1">
                                    <p className="font-display-semibold body-02 uppercase">
                                        {method.name}
                                    </p>
                                    {method.description && (
                                        <p className="font-display-regular body-02 text-gray-600">
                                            {method.description}
                                        </p>
                                    )}
                                </div>
                            </label>
                        ))}
                    </div>
                )}

                {errors.paymentMethodId && <span className="body-03 font-display-regular" style={{ color: 'var(--color-error)' }}>{errors.paymentMethodId}</span>}
            </div>

            {/* Submit Button */}
            <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-black text-third body-02 font-display-regular py-3 rounded-none cursor-pointer disabled:opacity-50"
            >
                {isLoading ? 'Processing...' : 'Place Order'}
            </button>
        </form>
    );
};
