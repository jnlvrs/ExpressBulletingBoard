'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // this.hasMany(models.posts, {
      //   foriegnKey: 'UserId'
      // })
    }
  };
  users.init({
    UserId: {
      type:DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    FirstName: DataTypes.STRING,
    LastName: DataTypes.STRING,
    Email: {
      type: DataTypes.STRING,
      unique: true
    },
    UserName: {
      type: DataTypes.STRING,
      unique: true
    },
    Password: DataTypes.STRING,
    Admin:{
      type: DataTypes.BOOLEAN,
      default: false
    },
    Deleted: {
      type: DataTypes.BOOLEAN,
      default: false
    },
  }, {
    sequelize,
    modelName: 'users',
  });
  return users;
};