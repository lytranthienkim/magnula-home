'use client';

/**
 * ProductsModal Component
 * Displays product details modal with edit/view functionality
 */
export function ProductsModal({
  isOpen,
  product,
  editMode,
  editData,
  categories,
  collections,
  materials,
  fabricTypes,
  roomSuitabilities,
  statusUpdating,
  canUpdate,
  onClose,
  onEditClick,
  onEditModeChange,
  onEditDataChange,
  onSave,
  onDelete,
  onRestore,
  onCategoryChange,
  onCollectionChange,
  onMaterialChange,
  onFabricTypeChange,
  onRoomSuitabilityChange,
  onVariantChange,
  onAddImage,
  onRemoveImage,
  error,
  onErrorClear,
}) {
  if (!isOpen || !product) return null;

  const isDeleted = product.deletedAt;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[95vh] overflow-y-auto">
        {/* Header */}
        <div className="px-8 py-6 border-b border-gray-200 sticky top-0 bg-white">
          <h3 className="font-bold text-black">Item</h3>
        </div>

        {/* Content */}
        <div className="px-8 py-6 space-y-8">
          {/* Basic Information */}
          <div>
            <div className="space-y-4">
              <div className="flex items-start">
                <p className="text-xs text-black font-semibold uppercase w-40">Product Name:</p>
                {editMode ? (
                  <input
                    type="text"
                    value={editData.productName !== undefined ? editData.productName : product.productName || ''}
                    onChange={(e) => onEditDataChange({ ...editData, productName: e.target.value })}
                    className="flex-1 px-4 py-2 bg-white border border-[0.5px] border-gray-400 text-xs text-black focus:outline-none rounded"
                  />
                ) : (
                  <p className="flex-1 bg-gray-50 px-4 py-2 text-xs">{product.productName || 'N/A'}</p>
                )}
              </div>
              <div className="flex items-start">
                <p className="text-xs text-black font-semibold uppercase w-40">Status:</p>
                {editMode ? (
                  <select
                    value={editData.status !== undefined ? editData.status : product.status || ''}
                    onChange={(e) => onEditDataChange({ ...editData, status: e.target.value })}
                    className="flex-1 px-4 py-2 bg-white border border-gray-300 text-xs text-black rounded focus:outline-none focus:border-black"
                  >
                    <option value="">Select Status</option>
                    <option value="in stock">In Stock</option>
                    <option value="out of stock">Out of Stock</option>
                    <option value="discontinued">Discontinued</option>
                  </select>
                ) : (
                  <p className="flex-1 bg-gray-50 px-4 py-2 text-xs">{product.status || 'N/A'}</p>
                )}
              </div>
            </div>
          </div>

          {/* Category */}
          <div className="flex items-start">
            <p className="text-xs text-black font-semibold uppercase w-40">Category:</p>
            <select
              value={product.Category?.id || ''}
              onChange={(e) => onCategoryChange(e.target.value)}
              className="flex-1 px-4 py-2 bg-white border border-gray-300 text-xs text-black rounded focus:outline-none focus:border-black"
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat?.categoryName}
                </option>
              ))}
            </select>
          </div>

          {/* Collection */}
          <div className="flex items-start">
            <p className="text-xs text-black font-semibold uppercase w-40">Collection:</p>
            <select
              value={product.Collection?.id || ''}
              onChange={(e) => onCollectionChange(e.target.value)}
              className="flex-1 px-4 py-2 bg-white border border-gray-300 text-xs text-black rounded focus:outline-none focus:border-black"
            >
              <option value="">Select Collection</option>
              {collections.map((col) => (
                <option key={col.id} value={col.id}>
                  {col.collectionName}
                </option>
              ))}
            </select>
          </div>

          {/* Material */}
          <div className="flex items-start">
            <p className="text-xs text-black font-semibold uppercase w-40">Material:</p>
            <select
              value={product.Material?.id || ''}
              onChange={(e) => onMaterialChange(e.target.value)}
              className="flex-1 px-4 py-2 bg-white border border-gray-300 text-xs text-black rounded focus:outline-none focus:border-black"
            >
              <option value="">Select Material</option>
              {materials.map((mat) => (
                <option key={mat.id} value={mat.id}>
                  {mat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Fabric Type */}
          <div className="flex items-start">
            <p className="text-xs text-black font-semibold uppercase w-40">Fabric:</p>
            <select
              value={product.FabricType?.id || ''}
              onChange={(e) => onFabricTypeChange(e.target.value)}
              className="flex-1 px-4 py-2 bg-white border border-gray-300 text-xs text-black rounded focus:outline-none focus:border-black"
            >
              <option value="">Select Fabric Type</option>
              {fabricTypes.map((fab) => (
                <option key={fab.id} value={fab.id}>
                  {fab.name}
                </option>
              ))}
            </select>
          </div>

          {/* Room Suitability */}
          <div className="flex items-start">
            <p className="text-xs text-black font-semibold uppercase w-40">Room Size:</p>
            <select
              value={product.RoomSuitability?.id || ''}
              onChange={(e) => onRoomSuitabilityChange(e.target.value)}
              className="flex-1 px-4 py-2 bg-white border border-gray-300 text-xs text-black rounded focus:outline-none focus:border-black"
            >
              <option value="">Select Room Size</option>
              {roomSuitabilities.map((room) => (
                <option key={room.id} value={room.id}>
                  {room.name}
                </option>
              ))}
            </select>
          </div>

          {/* Variants */}
          {product.variants && product.variants.length > 0 && (
            <div>
              <p className="text-sm text-black font-semibold uppercase mb-4">Variants & Pricing</p>
              <div className="overflow-x-auto">
                <table className="w-full border border-gray-200 text-xs">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="border border-gray-200 px-4 py-2 text-left font-semibold">Overall Size</th>
                      <th className="border border-gray-200 px-4 py-2 text-left font-semibold">Seat Size</th>
                      <th className="border border-gray-200 px-4 py-2 text-left font-semibold">Price</th>
                      <th className="border border-gray-200 px-4 py-2 text-left font-semibold">Stock Quantity</th>
                    </tr>
                  </thead>
                  <tbody>
                    {product.variants.map((variant, idx) => (
                      <tr key={variant.id} className="hover:bg-gray-50">
                        <td className="border border-gray-200 px-4 py-2">
                          {editMode ? (
                            <input
                              type="text"
                              value={editData.variants?.[idx]?.overallSize ?? variant.overallSize ?? ''}
                              onChange={(e) => onVariantChange(idx, 'overallSize', e.target.value)}
                              className="w-full px-2 py-1 bg-white border border-gray-300 text-xs text-black rounded focus:outline-none"
                            />
                          ) : (
                            variant.overallSize || 'N/A'
                          )}
                        </td>
                        <td className="border border-gray-200 px-4 py-2">
                          {editMode ? (
                            <input
                              type="text"
                              value={editData.variants?.[idx]?.seatSize ?? variant.seatSize ?? ''}
                              onChange={(e) => onVariantChange(idx, 'seatSize', e.target.value)}
                              className="w-full px-2 py-1 bg-white border border-gray-300 text-xs text-black rounded focus:outline-none"
                            />
                          ) : (
                            variant.seatSize || 'N/A'
                          )}
                        </td>
                        <td className="border border-gray-200 px-4 py-2 font-semibold">
                          {editMode ? (
                            <div className="flex items-center">
                              <span className="text-xs text-gray-600 mr-1">$</span>
                              <input
                                type="number"
                                step="0.01"
                                placeholder="0.00"
                                value={editData.variants?.[idx]?.price !== undefined ? editData.variants[idx].price : (variant.price ?? '')}
                                onChange={(e) => onVariantChange(idx, 'price', e.target.value)}
                                className="w-full px-2 py-1 bg-white border border-gray-300 text-xs text-black rounded focus:outline-none"
                              />
                            </div>
                          ) : (
                            variant.price ? `$${parseFloat(variant.price).toFixed(2)}` : '$0.00'
                          )}
                        </td>
                        <td className="border border-gray-200 px-4 py-2">
                          {editMode ? (
                            <input
                              type="number"
                              value={editData.variants?.[idx]?.stockQuantity ?? variant.stockQuantity ?? ''}
                              onChange={(e) => onVariantChange(idx, 'stockQuantity', e.target.value)}
                              className="w-full px-2 py-1 bg-white border border-gray-300 text-xs text-black rounded focus:outline-none"
                            />
                          ) : (
                            variant.stockQuantity
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Product Images */}
          <div>
            <p className="text-sm text-black font-semibold uppercase mb-4">Product Images</p>
            {editMode && (
              <div className="mb-4">
                <label className="text-xs text-black font-semibold uppercase block mb-2">Add Image URL:</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter image URL"
                    value={editData.newImageUrl || ''}
                    onChange={(e) => onEditDataChange({ ...editData, newImageUrl: e.target.value })}
                    className="flex-1 px-4 py-2 bg-white border border-gray-300 text-xs text-black rounded focus:outline-none"
                  />
                  <button
                    onClick={() => onAddImage(editData.newImageUrl)}
                    className="px-4 py-2 bg-black text-white text-xs font-bold rounded hover:bg-gray-800"
                  >
                    Add
                  </button>
                </div>
              </div>
            )}
            {(editData.images || product.images) && (editData.images || product.images).length > 0 && (
              <div className="grid grid-cols-4 gap-3">
                {(editData.images || product.images).map((img, idx) => (
                  <div key={img.id} className="flex flex-col">
                    <div className="relative bg-gray-100 rounded overflow-hidden aspect-square mb-2">
                      <img src={img.imageUrl} alt="Product" className="w-full h-full object-cover" />
                      {img.isMain && (
                        <div className="absolute top-1 right-1 bg-yellow-500 text-white text-xs px-2 py-1 rounded font-semibold">MAIN</div>
                      )}
                    </div>
                    <p className="text-xs text-gray-600 break-all line-clamp-2 mb-2">{img.imageUrl}</p>
                    {editMode && (
                      <button
                        onClick={() => onRemoveImage(idx)}
                        disabled={((editData.images || product.images) || []).length === 1}
                        className="px-3 py-1 bg-red-600 text-white text-xs font-bold rounded hover:bg-red-700 transition w-full disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 py-6 border-t border-gray-200 flex justify-between items-center sticky bottom-0 bg-white">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-white border-2 border-gray-300 text-black text-xs font-bold hover:bg-gray-50 transition"
          >
            Close
          </button>
          <div className="flex gap-2">
            {editMode ? (
              <>
                <button
                  onClick={() => {
                    onEditModeChange(false);
                    onEditDataChange({});
                  }}
                  disabled={statusUpdating}
                  className="px-6 py-2 bg-white border-2 border-gray-300 text-black text-xs font-bold hover:bg-gray-50 transition disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={onSave}
                  disabled={statusUpdating}
                  className="px-6 py-2 bg-black text-white text-xs font-bold hover:bg-gray-800 disabled:opacity-50 transition"
                >
                  {statusUpdating ? 'Saving...' : 'Save'}
                </button>
              </>
            ) : (
              <>
                {canUpdate && (
                  <button
                    onClick={onEditClick}
                    className="px-6 py-2 bg-black text-white text-xs font-bold hover:bg-gray-800 transition"
                  >
                    Edit
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
