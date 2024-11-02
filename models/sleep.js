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

    calculateDuration() {
      if (this.clockIn && this.clockOut) {
        const clockInDate = new Date(this.clockIn);
        const clockOutDate = new Date(this.clockOut);
        const durationMs = clockOutDate - clockInDate;
        
        // Convert milliseconds to ISO duration string for PostgreSQL interval
        const hours = Math.floor(durationMs / (1000 * 60 * 60));
        const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((durationMs % (1000 * 60)) / 1000);
        
        return `${hours}:${minutes}:${seconds}`;
      }
      return null;
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
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Duration as PostgreSQL interval'
    }
  }, {
    sequelize,
    modelName: 'Sleep',
    tableName: 'Sleeps',
    hooks: {
      beforeSave: (instance) => {
        if (instance.clockIn && instance.clockOut) {
          instance.duration = instance.calculateDuration();
        }
      }
    }
  });

  return Sleep;
};