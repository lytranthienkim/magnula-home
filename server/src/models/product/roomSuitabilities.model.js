import { DataTypes } from 'sequelize';
import db from '../../config/db.js';

const RoomSuitability = db.define(
  'RoomSuitability',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },

    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: 'name',
    },

    description: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'description',
    },

    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false,
      field: 'is_active',
    },

    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'deleted_at',
    },
  },
  {
    tableName: 'room_suitabilities',
    timestamps: true,
    underscored: true,
    paranoid: true,  // Enable soft delete
    indexes: [
      {
        // Unique constraint only for non-deleted records
        name: 'unique_room_suitability_name_active',
        fields: ['name', 'deleted_at'],
        unique: true,
        where: { deletedAt: null },
        // Allows same name for deleted + active room suitabilities
      },
    ],
  }
);

export default RoomSuitability;
