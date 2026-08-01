'use client';

export default function Error({ error, reset }) {
  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-white px-4">
      <div className="max-w-md text-center">
        <p className="text-gray-600 mb-6">Something went wrong. Please try again.</p>
        <button
          onClick={() => reset()}
          className="px-5 py-2 bg-black text-white font-semibold rounded hover:bg-gray-800 transition"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
