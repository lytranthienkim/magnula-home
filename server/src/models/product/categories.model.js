import { DataTypes } from 'sequelize';
import db from '../../config/db.js';

const Category = db.define(
  'Category',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },

    categoryName: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: {
        name: 'unique_category_name_not_deleted',
        msg: 'Category name already exists',
      },
      field: 'category_name',
      validate: {
        len: [2, 100],
      },
    },

    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      field: 'is_active',
    },

    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'deleted_at',
    },
  },
  {
    tableName: 'categories',
    timestamps: true,
    underscored: true,
    paranoid: true, // Enable soft delete
  }
);

export default Category;
