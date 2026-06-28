const MIN_LENGTH = 5;
const MAX_LENGTH = 150;

const checkRepeatingSequences = (str) => {
    // Ký tự lặp liên tiếp 4+ lần (aaaa, 1111, !!!!)
    return /(.)\1{3,}/.test(str);
};

/**
 * Check địa chỉ có cả chữ và số không
 */
const hasAlphanumeric = (str) => {
    const hasLetters = /[a-zA-Z]/.test(str);
    const hasNumbers = /[0-9]/.test(str);
    return hasLetters && hasNumbers;
};

/**
 * Validate Shipping Address (Client Side)
 */
export const validateShippingAddress = (address) => {
    // Trim whitespace
    const trimmed = address?.trim() || '';

    // 1. Check length
    if (trimmed.length < MIN_LENGTH) {
        return {
            valid: false,
            error: `Address must be at least ${MIN_LENGTH} characters`
        };
    }

    if (trimmed.length > MAX_LENGTH) {
        return {
            valid: false,
            error: `Address must not exceed ${MAX_LENGTH} characters`
        };
    }

    // 2. Check repeating sequences
    if (checkRepeatingSequences(trimmed)) {
        return {
            valid: false,
            error: 'Invalid address '
        };
    }

    // 3. Check alphanumeric (must have both letters and numbers)
    if (!hasAlphanumeric(trimmed)) {
        return {
            valid: false,
            error: 'Address must contain both letters and numbers '
        };
    }

    return {
        valid: true,
        error: ''
    };
};

export const getAddressError = (address) => {
    const validation = validateShippingAddress(address);
    return validation.error;
};

export const isValidAddress = (address) => {
    return validateShippingAddress(address).valid;
};
