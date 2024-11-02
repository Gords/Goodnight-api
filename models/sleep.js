// models/sleep.js
'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Sleep extends Model {
    static associate(models) {
      Sleep.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user'
      });
    }
  }

  Sleep.init({
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    clockIn: {
      type: DataTypes.DATE,
      allowNull: false
    },
    clockOut: {
      type: DataTypes.DATE,
      allowNull: true
    },
    duration: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'Duration in minutes',
      get() {
        if (this.clockOut && this.clockIn) {
          return Math.round((this.clockOut - this.clockIn) / (1000 * 60));
        }
        return null;
      }
    }
  }, {
    sequelize,
    modelName: 'Sleep',
    hooks: {
      beforeSave: (sleep) => {
        if (sleep.clockOut && sleep.clockIn) {
          sleep.duration = Math.round((sleep.clockOut - sleep.clockIn) / (1000 * 60));
        }
      }
    }
  });

  return Sleep;
};