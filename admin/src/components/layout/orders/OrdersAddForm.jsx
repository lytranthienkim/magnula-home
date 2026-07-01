'use client';

export default function OrdersAddForm({
  formData,
  selectedProducts,
  productSelect,
  variantSelect,
  productQuantity,
  productVariants,
  products,
  countries,
  states,
  paymentMethods,
  loading,
  loadingCountries,
  loadingStates,
  error,
  onFormDataChange,
  onCountryChange,
  onProductChange,
  onProductQuantityChange,
  onAddProduct,
  onRemoveProduct,
  onCreateOrder,
  onClose,
  onProductSelectChange,
  onVariantSelectChange,
}) {
  const handleAddProduct = () => {
    onAddProduct(productSelect, variantSelect, productQuantity, productVariants);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full p-8 max-h-[90vh] overflow-y-auto">
        <h3 className="text-xl font-bold text-black mb-6">Create New Order</h3>

        <div className="space-y-4 mb-8">
          {/* Error Message */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded">
              <p className="text-xs text-red-600">{error}</p>
            </div>
          )}

          {/* Customer Info Row */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-semibold text-black uppercase block mb-2">Name *</label>
              <input
                type="text"
                value={formData.customerName}
                onChange={(e) => onFormDataChange({ ...formData, customerName: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded text-sm text-black focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-black uppercase block mb-2">Phone *</label>
              <input
                type="tel"
                value={formData.customerPhone}
                onChange={(e) => onFormDataChange({ ...formData, customerPhone: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded text-sm text-black focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-black uppercase block mb-2">Email *</label>
              <input
                type="email"
                value={formData.customerEmail}
                onChange={(e) => onFormDataChange({ ...formData, customerEmail: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded text-sm text-black focus:outline-none"
              />
            </div>
          </div>

          {/* Address Row */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-semibold text-black uppercase block mb-2">Country</label>
              <select
                value={formData.countryRegion}
                onChange={(e) => onCountryChange(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded text-sm text-black focus:outline-none"
              >
                <option value="">
                  {loadingCountries ? 'Loading countries...' : 'Select Country'}
                </option>
                {Array.isArray(countries) && countries.length > 0 ? (
                  countries.map((c) => (
                    <option key={c.iso2 || c.name} value={c.name}>
                      {c.name}
                    </option>
                  ))
                ) : (
                  <option disabled>No countries available</option>
                )}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-black uppercase block mb-2">State/Province</label>
              <select
                value={formData.stateProvince}
                onChange={(e) => onFormDataChange({ ...formData, stateProvince: e.target.value })}
                disabled={!formData.countryRegion || loadingStates}
                className="w-full px-4 py-2 border border-gray-300 rounded text-sm text-black focus:outline-none disabled:bg-gray-100"
              >
                <option value="">
                  {!formData.countryRegion
                    ? 'Select country first'
                    : loadingStates
                      ? 'Loading states...'
                      : states.length === 0
                        ? 'No states available'
                        : 'Select State/Province'}
                </option>
                {Array.isArray(states) && states.length > 0 && !loadingStates && (
                  states.map((s) => (
                    <option key={s.iso2 || s.name} value={s.name}>
                      {s.name}
                    </option>
                  ))
                )}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-black uppercase block mb-2">Shipping Address *</label>
              <input
                type="text"
                value={formData.shippingAddress}
                onChange={(e) => onFormDataChange({ ...formData, shippingAddress: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded text-sm text-black focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-black uppercase block mb-2">Payment Method *</label>
            <select
              value={formData.paymentMethodId}
              onChange={(e) => onFormDataChange({ ...formData, paymentMethodId: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded text-sm text-black focus:outline-none"
            >
              <option value="">Select Payment Method</option>
              {paymentMethods.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>
          </div>

          <div className="border-t border-gray-300 pt-6">
            <h4 className="text-sm font-semibold text-black uppercase mb-4">Products *</h4>

            <div className="space-y-3 mb-4">
              {/* Product Selection Row */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-semibold text-black uppercase block mb-2">Product</label>
                  <select
                    value={productSelect}
                    onChange={(e) => onProductChange(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded text-sm text-black focus:outline-none"
                  >
                    <option value="">Select Product</option>
                    {Array.isArray(products) && products.length > 0 ? (
                      products.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.productName}
                        </option>
                      ))
                    ) : (
                      <option disabled>No products available</option>
                    )}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-black uppercase block mb-2">Variant</label>
                  <select
                    value={variantSelect}
                    onChange={(e) => onVariantSelectChange(e.target.value)}
                    disabled={!productSelect || productVariants.length === 0}
                    className="w-full px-4 py-2 border border-gray-300 rounded text-sm text-black focus:outline-none disabled:bg-gray-100"
                  >
                    <option value="">Select Variant</option>
                    {productVariants.map((v) => {
                      const isOutOfStock = (v.stockQuantity || 0) <= 0;
                      return (
                        <option
                          key={v.id}
                          value={v.id}
                          disabled={isOutOfStock}
                        >
                          {v.overallSize} - ${parseFloat(v.price || 0).toFixed(2)}
                          {isOutOfStock ? ' (Out of Stock)' : ` (Stock: ${v.stockQuantity || 0})`}
                        </option>
                      );
                    })}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-black uppercase block mb-2">
                    Quantity
                    {variantSelect && productVariants.find(v => v.id === parseInt(variantSelect)) && (
                      <span className="text-gray-500 text-xs font-normal">
                        {' '}(Max: {productVariants.find(v => v.id === parseInt(variantSelect))?.stockQuantity || 0})
                      </span>
                    )}
                  </label>
                  <input
                    type="number"
                    min="1"
                    max={variantSelect && productVariants.find(v => v.id === parseInt(variantSelect)) ? (productVariants.find(v => v.id === parseInt(variantSelect))?.stockQuantity || 0) : undefined}
                    value={productQuantity}
                    onChange={(e) => onProductQuantityChange(parseInt(e.target.value))}
                    className="w-full px-4 py-2 border border-gray-300 rounded text-sm text-black focus:outline-none"
                  />
                </div>
              </div>

              {/* Price Info Row */}
              {variantSelect && productVariants.find(v => v.id === parseInt(variantSelect)) && (
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-black uppercase block mb-2">Unit Price</label>
                    <div className="px-4 py-2 bg-gray-100 rounded text-sm text-black font-semibold">
                      ${parseFloat(productVariants.find(v => v.id === parseInt(variantSelect))?.price || 0).toFixed(2)}
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-black uppercase block mb-2">Total Price</label>
                    <div className="px-4 py-2 bg-gray-100 rounded text-sm text-black font-semibold">
                      ${(parseFloat(productVariants.find(v => v.id === parseInt(variantSelect))?.price || 0) * productQuantity).toFixed(2)}
                    </div>
                  </div>
                  <div>&nbsp;</div>
                </div>
              )}

              <button
                onClick={handleAddProduct}
                className="w-full px-4 py-2 bg-black text-white text-xs font-bold rounded hover:bg-gray-800"
              >
                Add Product to Order
              </button>
            </div>

            {selectedProducts.length > 0 && (
              <div className="bg-gray-50 rounded p-3">
                <div className="text-xs font-semibold text-black uppercase mb-2">Selected Products:</div>
                <div className="space-y-2">
                  {selectedProducts.map((item, idx) => {
                    const totalPrice = (item.price || 0) * item.quantity;
                    return (
                      <div key={idx} className="flex justify-between items-center bg-white p-2 rounded text-xs">
                        <span className="text-black flex-1">
                          Product {item.productId} × {item.quantity} @ ${parseFloat(item.price || 0).toFixed(2)} = ${totalPrice.toFixed(2)}
                        </span>
                        <button
                          onClick={() => onRemoveProduct(idx)}
                          className="text-red-600 font-bold hover:text-red-800 ml-2"
                        >
                          Remove
                        </button>
                      </div>
                    );
                  })}
                  <div className="border-t border-gray-200 pt-2 mt-2 flex justify-between text-xs font-semibold text-black">
                    <span>Order Subtotal:</span>
                    <span>${selectedProducts.reduce((sum, item) => sum + ((item.price || 0) * item.quantity), 0).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-6 py-2 border border-gray-300 text-black text-xs font-bold rounded hover:bg-gray-50 transition disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onCreateOrder}
            disabled={loading}
            className="px-6 py-2 bg-black text-white text-xs font-bold rounded hover:bg-gray-800 transition disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create Order'}
          </button>
        </div>
      </div>
    </div>
  );
}
