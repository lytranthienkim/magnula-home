import { DataTypes } from 'sequelize';
import db from '../../config/db.js';

const ProductVariant = db.define(
  'ProductVariant',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },

    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'product_id',
      references: {
        model: 'products',
        key: 'id',
      },
      onDelete: 'CASCADE',  // Cascade soft delete with product
      onUpdate: 'CASCADE',
    },

    overallSize: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: 'overall_size',
      validate: {
        len: [5, 100],
      },
    },

    seatSize: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: 'seat_size',
    },

    color: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: 'color',
    },

    price: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      validate: {
        min: 0,  // Only validate minimum value, not decimal format
      },
    },

    stockQuantity: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      field: 'stock_quantity',
      validate: {
        isInt: true,
        min: 0,
      },
    },


    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'deleted_at',
    },
  },
  {
    tableName: 'product_variants',
    timestamps: true,
    underscored: true,
    paranoid: true,  // Enable soft delete
    hooks: {
      afterCreate: updateProductStock,
      afterUpdate: updateProductStock,
      afterDestroy: updateProductStock,
    },
  }
);

// Hook để auto-update product status dựa trên stock
async function updateProductStock(variant, options) {
  try {
    // Lazy load Product model to avoid circular dependency
    const { default: Product } = await import('./productItems.model.js');

    // Get product
    const product = await Product.findByPk(variant.productId);
    if (!product) return;

    // Get all variants for this product (including current one)
    const variants = await ProductVariant.findAll({
      where: { productId: variant.productId },
      paranoid: true, // Only count non-deleted variants
    });

    // Calculate total stock from all variants
    const totalStock = variants.reduce((sum, v) => sum + (v.stockQuantity || 0), 0);

    // Update product status based on total stock
    const newStatus = totalStock > 0 ? 'in stock' : 'out of stock';
    if (product.status !== newStatus) {
      await product.update(
        { status: newStatus },
        { hooks: false, individualHooks: false } // Avoid infinite loop
      );
    }
  } catch (error) {
    console.error('Error updating product stock status:', error);
  }
}

export default ProductVariant;
