'use client';

export default function CollectionImageModal({
  isOpen,
  image,
  loading,
  onClose,
  onDelete,
}) {
  if (!isOpen || !image) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-md w-full p-6">
        <div className="flex justify-center mb-4">
          <img src={image.imageUrl} alt="Collection" className="max-w-full max-h-64 rounded object-cover" />
        </div>
        <div className="space-y-3 mb-6">
          <div className="flex items-start gap-2">
            <p className="text-xs font-semibold text-gray-600 w-24">ID:</p>
            <p className="text-xs text-black">{image.id}</p>
          </div>
          <div className="flex items-start gap-2">
            <p className="text-xs font-semibold text-gray-600 w-24">Collection:</p>
            <p className="text-xs text-black">{image.collectionId || 'N/A'}</p>
          </div>
          <div className="flex items-start gap-2">
            <p className="text-xs font-semibold text-gray-600 w-24">URL:</p>
            <p className="text-xs text-black break-all">{image.imageUrl || 'N/A'}</p>
          </div>
          <div className="flex items-start gap-2">
            <p className="text-xs font-semibold text-gray-600 w-24">Uploaded:</p>
            <p className="text-xs text-black">{new Date(image.createdAt || 0).toLocaleString('vi-VN')}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 px-4 py-2 bg-white border border-gray-300 text-black text-xs font-bold rounded hover:bg-gray-50 disabled:opacity-50"
          >
            Close
          </button>
          <button
            onClick={() => {
              if (window.confirm('Delete this collection image?')) {
                onDelete(image);
              }
            }}
            disabled={loading}
            className="flex-1 px-4 py-2 bg-red-600 text-white text-xs font-bold rounded hover:bg-red-700 disabled:opacity-50"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
