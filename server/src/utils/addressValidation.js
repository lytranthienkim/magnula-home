const MIN_LENGTH = 5;
const MAX_LENGTH = 150;

const checkRepeatingSequences = (str) => {
    return /(.)\1{3,}/.test(str);
};

const hasAlphanumeric = (str) => {
    const hasLetters = /[a-zA-Z]/.test(str);
    const hasNumbers = /[0-9]/.test(str);
    return hasLetters && hasNumbers;
};

export const validateShippingAddress = (address) => {
    const trimmed = address?.trim() || '';

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

    if (checkRepeatingSequences(trimmed)) {
        return {
            valid: false,
            error: 'Invalid address '
        };
    }

    if (!hasAlphanumeric(trimmed)) {
        return {
            valid: false,
            error: 'Address must contain both letters and numbers'
        };
    }

    return {
        valid: true,
        error: ''
    };
};
