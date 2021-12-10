'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class posts extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // this.belongsTo(models.users);
    }
  };
  posts.init({
    PostId: { 
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    PostTitle: DataTypes.STRING,
    PostBody: DataTypes.STRING,
    UserId: { 
     type: DataTypes.INTEGER,
     foreignKey: true
    },
    Deleted: {
      type: DataTypes.BOOLEAN,
      default: false
    },
  }, {
    sequelize,
    modelName: 'posts',
  });
  return posts;
};