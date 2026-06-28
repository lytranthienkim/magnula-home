import { DataTypes } from 'sequelize';
import db from '../../config/db.js';

const CollectionImage = db.define(
  'CollectionImage',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },

    collectionId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'collection_id',
      references: {
        model: 'collections',
        key: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },

    imageUrl: {
      type: DataTypes.STRING(500),
      allowNull: false,
      field: 'image_url',
      validate: {
        isUrl: true,
      },
    },
  },
  {
    tableName: 'collection_images',
    timestamps: true,
    underscored: true,
    paranoid: false, // Don't use soft delete for images
  }
);

export default CollectionImage;
