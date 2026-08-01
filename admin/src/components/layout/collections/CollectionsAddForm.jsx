'use client';

import { uploadImageToR2, deleteImageFromR2 } from '@/api/upload';

export default function CollectionsAddForm({
  showAddForm,
  formData,
  formLoading,
  formError,
  onFormDataChange,
  onClearError,
  onSubmit,
  onCancel,
}) {
  if (!showAddForm) return null;

  const handleImageFileSelect = async (e, idx) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const result = await uploadImageToR2(file);
      if (result.success && result.imageUrl) {
        const newImages = [...formData.images];
        newImages[idx] = result.imageUrl;
        onFormDataChange({ ...formData, images: newImages });
      }
    } catch (err) {
      console.error('Upload failed:', err);
    }
  };

  const handleAddImage = () => {
    onFormDataChange({
      ...formData,
      images: [...formData.images, ''],
    });
  };

  const handleRemoveImage = (index) => {
    const imageUrl = formData.images[index];
    if (imageUrl) {
      deleteImageFromR2(imageUrl).catch((err) => console.error('Failed to delete image from R2:', err));
    }
    onFormDataChange({
      ...formData,
      images: formData.images.filter((_, i) => i !== index),
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto p-8">
        <h3 className="text-xl font-bold text-black mb-6">Add New Collection</h3>
        <div className="space-y-4 mb-8">
          {formError && <div className="p-3 bg-red-50 border border-red-200 rounded"><p className="text-xs text-red-600">{formError}</p></div>}

          <div>
            <label className="text-xs font-semibold text-black uppercase block mb-2">Name *</label>
            <input
              type="text"
              value={formData.collectionName}
              onChange={(e) => onFormDataChange({ ...formData, collectionName: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded text-sm text-black focus:outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-black uppercase block mb-2">Color *</label>
            <div className="flex gap-2">
              <input
                type="color"
                value={formData.colorHex}
                onChange={(e) => onFormDataChange({ ...formData, colorHex: e.target.value })}
                className="w-16 h-10 border border-gray-300 rounded cursor-pointer"
              />
              <input
                type="text"
                value={formData.colorHex}
                onChange={(e) => onFormDataChange({ ...formData, colorHex: e.target.value })}
                placeholder="#000000"
                className="flex-1 px-4 py-2 border border-gray-300 rounded text-sm text-black focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-black uppercase block mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => onFormDataChange({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded text-sm text-black focus:outline-none"
              rows="2"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-3">
              <label className="text-xs font-semibold text-black uppercase block">Collection Images</label>
              <button
                type="button"
                onClick={handleAddImage}
                className="text-xs text-black hover:text-gray-600 font-semibold"
              >
                + Add
              </button>
            </div>
            {formData.images.length > 0 && (
              <div className="space-y-2">
                {formData.images.map((img, idx) => (
                  <div key={idx} className="flex gap-2 items-start">
                    <div className="flex-1">
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/gif,image/webp"
                        onChange={(e) => handleImageFileSelect(e, idx)}
                        className="w-full px-3 py-2 border border-gray-300 rounded text-xs focus:outline-none focus:border-black disabled:opacity-50"
                      />
                      {img && <p className="text-xs text-gray-600 mt-1 break-all line-clamp-2">{img}</p>}
                      {img && <div className="flex items-center justify-center w-full h-16 bg-gray-100 rounded border border-gray-200 mt-1"><img src={img} alt={`Preview ${idx}`} className="h-full object-contain" /></div>}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(idx)}
                      disabled={formData.images.length === 1}
                      className="px-2 py-2 bg-red-600 text-white text-xs font-bold rounded hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            disabled={formLoading}
            className="px-6 py-2 border border-gray-300 text-black text-xs font-bold rounded hover:bg-gray-50 transition disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onSubmit}
            disabled={formLoading}
            className="px-6 py-2 bg-black text-white text-xs font-bold rounded hover:bg-gray-800 transition disabled:opacity-50"
          >
            {formLoading ? 'Adding...' : 'Add'}
          </button>
        </div>
      </div>
    </div>
  );
}
