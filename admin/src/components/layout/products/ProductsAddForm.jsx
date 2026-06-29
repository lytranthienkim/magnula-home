'use client';

/**
 * ProductsAddForm Component
 * Modal form for adding new products
 */
export function ProductsAddForm({
  isOpen,
  formData,
  formErrors,
  formLoading,
  categories,
  materials,
  fabricTypes,
  roomSuitabilities,
  collections,
  error,
  onFormDataChange,
  onAddVariant,
  onRemoveVariant,
  onAddImage,
  onRemoveImage,
  onSubmit,
  onCancel,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full p-8 max-h-[90vh] overflow-y-auto">
        <h3 className="text-xl font-bold text-black mb-6">Add New Product</h3>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-sm text-red-600">
            {error}
          </div>
        )}

        <div className="space-y-4 mb-8">
          {/* Product Name */}
          <div>
            <label className="text-xs font-semibold text-black uppercase block mb-2">Product Name *</label>
            <input
              type="text"
              value={formData.productName}
              onChange={(e) => onFormDataChange({ ...formData, productName: e.target.value })}
              className={`w-full px-4 py-2 border rounded text-sm text-black focus:outline-none ${formErrors.productName ? 'border-red-500' : 'border-gray-300'}`}
            />
            {formErrors.productName && <span className="text-xs text-red-500">{formErrors.productName}</span>}
          </div>

          {/* Attributes Row 1 */}
          <div className="grid grid-cols-2 gap-4">
            {/* Category */}
            <div>
              <label className="text-xs font-semibold text-black uppercase block mb-2">Category *</label>
              <select
                value={formData.categoryId}
                onChange={(e) => onFormDataChange({ ...formData, categoryId: e.target.value })}
                className={`w-full px-4 py-2 border rounded text-sm text-black focus:outline-none ${formErrors.categoryId ? 'border-red-500' : 'border-gray-300'}`}
              >
                <option value="">Select Category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.categoryName}</option>
                ))}
              </select>
              {formErrors.categoryId && <span className="text-xs text-red-500">{formErrors.categoryId}</span>}
            </div>

            {/* Material */}
            <div>
              <label className="text-xs font-semibold text-black uppercase block mb-2">Material *</label>
              <select
                value={formData.materialId}
                onChange={(e) => onFormDataChange({ ...formData, materialId: e.target.value })}
                className={`w-full px-4 py-2 border rounded text-sm text-black focus:outline-none ${formErrors.materialId ? 'border-red-500' : 'border-gray-300'}`}
              >
                <option value="">Select Material</option>
                {materials.map((m) => (
                  <option key={m.id} value={m.id}>{m.name}</option>
                ))}
              </select>
              {formErrors.materialId && <span className="text-xs text-red-500">{formErrors.materialId}</span>}
            </div>
          </div>

          {/* Attributes Row 2 */}
          <div className="grid grid-cols-2 gap-4">
            {/* Fabric Type */}
            <div>
              <label className="text-xs font-semibold text-black uppercase block mb-2">Fabric Type *</label>
              <select
                value={formData.fabricTypeId}
                onChange={(e) => onFormDataChange({ ...formData, fabricTypeId: e.target.value })}
                className={`w-full px-4 py-2 border rounded text-sm text-black focus:outline-none ${formErrors.fabricTypeId ? 'border-red-500' : 'border-gray-300'}`}
              >
                <option value="">Select Fabric Type</option>
                {fabricTypes.map((f) => (
                  <option key={f.id} value={f.id}>{f.name}</option>
                ))}
              </select>
              {formErrors.fabricTypeId && <span className="text-xs text-red-500">{formErrors.fabricTypeId}</span>}
            </div>

            {/* Room Suitability */}
            <div>
              <label className="text-xs font-semibold text-black uppercase block mb-2">Room Suitability *</label>
              <select
                value={formData.roomSuitabilityId}
                onChange={(e) => onFormDataChange({ ...formData, roomSuitabilityId: e.target.value })}
                className={`w-full px-4 py-2 border rounded text-sm text-black focus:outline-none ${formErrors.roomSuitabilityId ? 'border-red-500' : 'border-gray-300'}`}
              >
                <option value="">Select Room Suitability</option>
                {roomSuitabilities.map((r) => (
                  <option key={r.id} value={r.id}>{r.name}</option>
                ))}
              </select>
              {formErrors.roomSuitabilityId && <span className="text-xs text-red-500">{formErrors.roomSuitabilityId}</span>}
            </div>
          </div>

          {/* Collection (Optional) */}
          <div>
            <label className="text-xs font-semibold text-black uppercase block mb-2">Collection (Optional)</label>
            <select
              value={formData.collectionId}
              onChange={(e) => onFormDataChange({ ...formData, collectionId: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded text-sm text-black focus:outline-none"
            >
              <option value="">Select Collection</option>
              {collections.map((c) => (
                <option key={c.id} value={c.id}>{c.collectionName}</option>
              ))}
            </select>
          </div>

          {/* Variants Section */}
          <div className="border-t pt-4">
            <div className="flex justify-between items-center mb-3">
              <label className="text-xs font-semibold text-black uppercase block">Variants *</label>
              <button
                type="button"
                onClick={() => onAddVariant()}
                className="text-xs text-black hover:text-gray-600 font-semibold"
              >
                + Add
              </button>
            </div>
            {formErrors.variants && <span className="text-xs text-red-500 block mb-2">{formErrors.variants}</span>}
            <div className="space-y-3 overflow-x-auto">
              {formData.variants.map((variant, idx) => (
                <div key={idx} className="p-3 bg-gray-50 rounded border border-gray-200">
                  <div className="grid grid-cols-2 lg:grid-cols-5 gap-2">
                    <div>
                      <label className="text-xs text-gray-500 block mb-1">Size *</label>
                      <input
                        type="text"
                        placeholder="e.g., W30 x D28 x H17"
                        value={variant.overallSize}
                        onChange={(e) => {
                          const newVariants = [...formData.variants];
                          newVariants[idx].overallSize = e.target.value;
                          onFormDataChange({ ...formData, variants: newVariants });
                        }}
                        className="w-full px-2 py-1.5 border border-gray-300 rounded text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 block mb-1">Seat Size</label>
                      <input
                        type="text"
                        placeholder="e.g., W30 x D28 x H17"
                        value={variant.seatSize}
                        onChange={(e) => {
                          const newVariants = [...formData.variants];
                          newVariants[idx].seatSize = e.target.value;
                          onFormDataChange({ ...formData, variants: newVariants });
                        }}
                        className="w-full px-2 py-1.5 border border-gray-300 rounded text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 block mb-1">Color</label>
                      <input
                        type="text"
                        placeholder="Hex"
                        value={variant.color}
                        onChange={(e) => {
                          const newVariants = [...formData.variants];
                          newVariants[idx].color = e.target.value;
                          onFormDataChange({ ...formData, variants: newVariants });
                        }}
                        className="w-full px-2 py-1.5 border border-gray-300 rounded text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 block mb-1">Price *</label>
                      <input
                        type="number"
                        placeholder="0.00"
                        step="0.01"
                        value={variant.price}
                        onChange={(e) => {
                          const newVariants = [...formData.variants];
                          newVariants[idx].price = e.target.value;
                          onFormDataChange({ ...formData, variants: newVariants });
                        }}
                        className="w-full px-2 py-1.5 border border-gray-300 rounded text-xs"
                      />
                    </div>
                    <div className="flex gap-2">
                      <div className="flex-1">
                        <label className="text-xs text-gray-500 block mb-1">Stock *</label>
                        <input
                          type="number"
                          placeholder="0"
                          value={variant.stockQuantity}
                          onChange={(e) => {
                            const newVariants = [...formData.variants];
                            newVariants[idx].stockQuantity = e.target.value;
                            onFormDataChange({ ...formData, variants: newVariants });
                          }}
                          className="w-full px-2 py-1.5 border border-gray-300 rounded text-xs"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => onRemoveVariant(idx)}
                        className="text-red-500 hover:text-red-700 font-bold text-lg self-end pb-1"
                        title="Remove variant"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Images Section */}
          <div className="border-t pt-4">
            <div className="flex justify-between items-center mb-3">
              <label className="text-xs font-semibold text-black uppercase block">Images *</label>
              <button
                type="button"
                onClick={() => onAddImage()}
                className="text-xs text-black hover:text-gray-600 font-semibold"
              >
                + Add
              </button>
            </div>
            {formErrors.images && <span className="text-xs text-red-500 block mb-2">{formErrors.images}</span>}
            <div className="space-y-2">
              {formData.images.map((image, idx) => (
                <div key={idx} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter image URL"
                    value={image.imageUrl}
                    onChange={(e) => {
                      const newImages = [...formData.images];
                      newImages[idx].imageUrl = e.target.value;
                      onFormDataChange({ ...formData, images: newImages });
                    }}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded text-xs focus:outline-none focus:border-black"
                  />
                  <button
                    type="button"
                    onClick={() => onRemoveImage(idx)}
                    className="text-red-500 hover:text-red-700 font-bold text-lg"
                    title="Remove image"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
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
            {formLoading ? 'Adding...' : 'Add Product'}
          </button>
        </div>
      </div>
    </div>
  );
}
