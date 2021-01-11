import sequelize from "../utils/DB";

import { DataTypes, Model, Optional } from "sequelize";
import { ProductModel } from "./Product.model";

interface RecipeAttributes {
  id: string,
  name: string,
}

interface RecipeCreationAttributes extends Optional<RecipeAttributes, "id"> { }

interface RecipeInstance extends Model<RecipeAttributes, RecipeCreationAttributes>, RecipeAttributes { }

export const RecipeModel = sequelize.define<RecipeInstance>("Recipe", {
  // Model attributes are defined here
  id: {
    primaryKey: true,
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING(500),
    allowNull: false
  },
})

export const RecipeToProduct = sequelize.define('RecipeToProduct', { quantity: DataTypes.INTEGER.UNSIGNED }, {});
RecipeModel.belongsToMany(ProductModel, { through: RecipeToProduct });
ProductModel.belongsToMany(RecipeModel, { through: RecipeToProduct });