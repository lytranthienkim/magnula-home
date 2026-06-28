'use client'

export const TrackingForm = ({
    trackingCode,
    setTrackingCode,
    handleTrackingSubmit,
    trackingLoading,
    trackingError
}) => {
    return (
        <form onSubmit={handleTrackingSubmit} className="w-full flex flex-col border-[0.25px] border-[#272727] p-4 md:p-6">
            <p className="body-02 font-display-semibold uppercase mb-2">Enter Order Code</p>
            <div className="flex flex-col gap-3 md:flex-row md:gap-2">
                <input
                    type="text"
                    value={trackingCode}
                    onChange={(e) => setTrackingCode(e.target.value)}
                    placeholder="e.g., ORD-2026-06-25-ABC123"
                    className="flex-1 body-02 font-display-regular border-[0.25px] border-[#272727] py-2 px-3 bg-background-primary focus:outline-none rounded-none"
                />
                <button
                    type="submit"
                    disabled={trackingLoading || !trackingCode.trim()}
                    className="bg-black text-third body-02 font-display-semibold py-2 px-6 rounded-none cursor-pointer disabled:opacity-50 md:px-8"
                >
                    {trackingLoading ? 'Tracking...' : 'Track'}
                </button>
            </div>
            {trackingError && (
                <p className="body-03 font-display-regular mt-3" style={{ color: 'var(--color-error)' }}>
                    {trackingError}
                </p>
            )}
        </form>
    );
};
