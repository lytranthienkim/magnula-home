'use client';
import { useState } from 'react';

export default function CollectionsModal({ selected, editMode, editData, saving, onClose, onEditModeChange, onEditDataChange, onSave, onRestore }) {
  if (!selected) return null;
  const isDeleted = selected.deletedAt !== null;
  const [imageUrl, setImageUrl] = useState('');

  const handleAddImage = () => {
    if (!imageUrl.trim()) return;
    const currentImages = editData.images || [];
    onEditDataChange({
      ...editData,
      images: [...currentImages, { imageUrl }],
    });
    setImageUrl('');
  };

  const handleRemoveImage = (index) => {
    const currentImages = editData.images || [];
    onEditDataChange({
      ...editData,
      images: currentImages.filter((_, i) => i !== index),
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="px-8 py-6 border-b border-gray-200">
          <h2 className="text-3xl font-bold text-black">{selected.collectionName || 'N/A'}</h2>
        </div>
        <div className="px-8 py-6 space-y-6">
          <div>
            <p className="text-sm text-black font-semibold uppercase mb-4">Details</p>
            <div className="space-y-4">
              <div className="flex items-center">
                <p className="text-xs text-black font-semibold uppercase w-32">Name:</p>
                <div className="flex-1 bg-gray-50 px-4 py-2">
                  {editMode ? (
                    <input type="text" value={editData.collectionName || ''} onChange={(e) => onEditDataChange({ ...editData, collectionName: e.target.value })} className="w-full px-4 py-2 bg-white border border-gray-400 text-xs text-black focus:outline-none" />
                  ) : (
                    <p className="text-xs font-medium text-black">{selected.collectionName || 'N/A'}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center">
                <p className="text-xs text-black font-semibold uppercase w-32">Color:</p>
                <div className="flex-1 bg-gray-50 px-4 py-2 flex items-center gap-3">
                  {editMode ? (
                    <>
                      <input type="text" value={editData.colorHex || ''} onChange={(e) => onEditDataChange({ ...editData, colorHex: e.target.value })} className="w-full px-4 py-2 bg-white border border-gray-400 text-xs text-black focus:outline-none" />
                    </>
                  ) : (
                    <>
                      <div className="w-8 h-8 rounded border border-gray-300" style={{ backgroundColor: selected.colorHex || '#000' }}></div>
                      <p className="text-xs font-medium text-black">{selected.colorHex || 'N/A'}</p>
                    </>
                  )}
                </div>
              </div>
              <div className="flex items-start">
                <p className="text-xs text-black font-semibold uppercase w-32 mt-2">Description:</p>
                <div className="flex-1 bg-gray-50 px-4 py-2">
                  {editMode ? (
                    <textarea value={editData.description || ''} onChange={(e) => onEditDataChange({ ...editData, description: e.target.value })} className="w-full px-4 py-2 bg-white border border-gray-400 text-xs text-black focus:outline-none" rows="3" />
                  ) : (
                    <p className="text-xs font-medium text-black">{selected.description || 'N/A'}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div>
            <p className="text-sm text-black font-semibold uppercase mb-4">Collection Images</p>
            {editMode ? (
              <div className="space-y-3">
                <div className="flex gap-2">
                  <input type="text" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="Image URL" className="flex-1 px-3 py-2 border border-gray-400 text-xs text-black focus:outline-none" />
                  <button onClick={handleAddImage} className="px-3 py-2 bg-gray-600 text-white text-xs font-bold hover:bg-gray-700">Add</button>
                </div>
                {(editData.images || []).length > 0 && (
                  <div className="space-y-2">
                    {(editData.images || []).map((img, idx) => (
                      <div key={idx} className="flex items-center justify-between bg-gray-50 p-2 rounded text-xs">
                        <span className="truncate text-gray-700">{img.imageUrl}</span>
                        <button onClick={() => handleRemoveImage(idx)} className="px-2 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700">Remove</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-2">
                {selected.images && selected.images.length > 0 ? (
                  selected.images.map((img, idx) => (
                    <div key={idx} className="flex items-center gap-3 bg-gray-50 p-2 rounded">
                      <img src={img.imageUrl} alt="Collection" className="w-10 h-10 object-cover rounded" />
                      <p className="text-xs text-gray-700 truncate">{img.imageUrl}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-gray-500">No images</p>
                )}
              </div>
            )}
          </div>
        </div>
        <div className="px-8 py-6 border-t border-gray-200 flex justify-between items-center">
          {editMode ? (
            <>
              <button onClick={() => { onEditModeChange(false); onEditDataChange(selected); }} className="px-3 py-1.5 bg-white border-2 border-gray-300 text-black text-xs font-bold hover:bg-gray-50 transition">Cancel</button>
              <button onClick={onSave} disabled={saving} className="px-3 py-1.5 bg-black text-white text-xs font-bold hover:bg-gray-800 disabled:opacity-50 transition">{saving ? 'Saving...' : 'Save'}</button>
            </>
          ) : (
            <>
              {isDeleted ? (
                <>
                  <button onClick={onClose} className="px-3 py-1.5 bg-white border-2 border-gray-300 text-black text-xs font-bold hover:bg-gray-50 transition">Close</button>
                  <button onClick={onRestore} disabled={saving} className="px-3 py-1.5 bg-green-600 text-white text-xs font-bold hover:bg-green-700 transition disabled:opacity-50">{saving ? 'Restoring...' : 'Restore'}</button>
                </>
              ) : (
                <>
                  <button onClick={onClose} className="px-3 py-1.5 bg-white border-2 border-gray-300 text-black text-xs font-bold hover:bg-gray-50 transition">Close</button>
                  <button onClick={() => { onEditDataChange(selected); onEditModeChange(true); }} className="px-3 py-1.5 bg-black text-white text-xs font-bold hover:bg-gray-800 transition">Edit</button>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
