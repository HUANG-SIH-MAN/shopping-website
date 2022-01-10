'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Commodity extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Commodity.belongsTo(models.Category)
    }
  };
  Commodity.init({
    name: DataTypes.STRING,
    price: DataTypes.INTEGER,
    introduction: DataTypes.TEXT,
    image: DataTypes.STRING,
    saleAmount: DataTypes.INTEGER,
    remainingNumber: DataTypes.INTEGER,
    viewCount: DataTypes.INTEGER,
    removed: DataTypes.BOOLEAN,
  }, {
    sequelize,
    modelName: 'Commodity',
  });
  return Commodity;
};