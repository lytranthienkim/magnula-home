import { DataTypes } from 'sequelize';
import db from '../../config/db.js';

const ProductImage = db.define(
  'ProductImage',
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
      onDelete: 'CASCADE',  // Images cascade delete with product (dependent entity)
      onUpdate: 'CASCADE',
    },

    imageUrl: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: 'image_url',
      validate: {
        isUrl: true,
      },
    },

    isMain: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: 'is_main',
    },

    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'deleted_at',
    },
  },
  {
    tableName: 'product_images',
    timestamps: true,
    underscored: true,
    paranoid: true,  // Enable soft delete
  }
);

export default ProductImage;
