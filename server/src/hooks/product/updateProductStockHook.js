export const updateProductStock = async (variant, options) => {
  try {
    const { default: Product } = await import('../../models/product/productItems.model.js');
    const { default: ProductVariant } = await import('../../models/product/productVariants.model.js');

    const product = await Product.findByPk(variant.productId);
    if (!product) return;

    const variants = await ProductVariant.findAll({
      where: { productId: variant.productId },
      paranoid: true,
    });

    const totalStock = variants.reduce((sum, v) => sum + (v.stockQuantity || 0), 0);

    const newStatus = totalStock > 0 ? 'in stock' : 'out of stock';
    if (product.status !== newStatus) {
      await product.update(
        { status: newStatus },
        { hooks: false, individualHooks: false }
      );
    }
  } catch (error) {
    console.error('Error updating product stock status:', error);
  }
};
