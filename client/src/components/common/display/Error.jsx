'use client'

export const Error = ({ message = 'An error occurred' }) => {
    return (
        <div className="w-full h-screen flex items-center justify-center">
            <p className="body-02 font-display-regular" style={{ color: 'var(--color-error)' }}>
                {message}
            </p>
        </div>
    );
};
