import sequelize from "../utils/DB";

import { DataTypes, Model, Optional } from "sequelize";
import { ProductModel } from "./Product.model";
import { RecipeModel } from "./Recipe.model";

interface UserAttributes {
  id: string,
  nickname: string,
  firstName?: string,
  lastName?: string,
  phoneNumber?: string
  password: string,
  emailAddress?: string
}

interface UserCreationAttributes extends Optional<UserAttributes, "id"> { }

export interface UserInstance extends Model<UserAttributes, UserCreationAttributes>, UserAttributes { }

export const UserModel = sequelize.define<UserInstance>("User", {
  // Model attributes are defined here
  id: {
    primaryKey: true,
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
  },
  nickname: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: null
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: null
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: null
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  emailAddress: {
    type: DataTypes.STRING,
    allowNull: false
  },
  phoneNumber: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: null
  },
})

UserModel.hasMany(ProductModel);
ProductModel.belongsTo(UserModel, { foreignKey: { allowNull: false }});

UserModel.hasMany(RecipeModel);
RecipeModel.belongsTo(UserModel, { foreignKey: { allowNull: false }});