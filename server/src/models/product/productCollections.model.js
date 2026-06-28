import { DataTypes } from 'sequelize';
import db from '../../config/db.js';

const Collection = db.define(
  'Collection',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },

    collectionName: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: 'collection_name',
    },

    colorHex: {
      type: DataTypes.STRING(7),
      allowNull: false,
      field: 'color_hex',
      validate: {
        is: /^#[0-9A-F]{6}$/i,
      },
    },

    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'deleted_at',
    },
  },
  {
    tableName: 'collections',
    timestamps: true,
    underscored: true,
    paranoid: true,  // Enable soft delete
    indexes: [
      {
        // Unique constraint only for non-deleted records
        name: 'unique_collection_name_active',
        fields: ['collection_name', 'deleted_at'],
        unique: true,
        where: { deletedAt: null },
        // Allows same name for deleted + active collections
      },
    ],
  }
);

export default Collection;
