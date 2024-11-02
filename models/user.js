'use strict';
const { Model } = require('sequelize');
const { hashPassword } = require('../utils/password');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      // A user has many sleep records
      User.hasMany(models.Sleep, {
        foreignKey: 'userId',
        as: 'sleepRecords'
      });

      // A user follows many users
      User.belongsToMany(models.User, {
        through: models.Follow,
        as: 'following',
        foreignKey: 'followerId',
        otherKey: 'followingId'
      });

      // A user has many followers
      User.belongsToMany(models.User, {
        through: models.Follow,
        as: 'followers',
        foreignKey: 'followingId',
        otherKey: 'followerId'
      });
    }
  }

  User.init({
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        len: [3, 30]
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'Users', 
    hooks: {
      beforeCreate: async (user) => {
        user.password = await hashPassword(user.password);
      },
      beforeUpdate: async (user) => {
        if (user.changed('password')) {
          user.password = await hashPassword(user.password);
        }
      }
    }
  });

  return User;
};