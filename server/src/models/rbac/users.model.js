import { DataTypes } from 'sequelize';
import db from '../../config/db.js';

const User = db.define(
  'User',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },

    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },

    passwordHash: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: 'password_hash',
    },

    fullName: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: 'full_name',
    },

    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      field: 'is_active',
    },
  },
  {
    tableName: 'users',
    timestamps: true,
    underscored: true,
    paranoid: false,  // Users can NEVER be deleted - deactivate instead
  }
);

export default User;
