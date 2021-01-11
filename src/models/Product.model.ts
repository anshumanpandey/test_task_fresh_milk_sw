import sequelize from "../utils/DB";

import { DataTypes, Model, Optional } from "sequelize";

export enum MEASURE_UNITS {
  ML = "Ml",
  KG = "Kg",
  GR = "Gr",
  OZ = "Oz"
}

export const MeasureUnitsArr = Object.values(MEASURE_UNITS).filter(k => !Number.isInteger(k)) as string[]


interface ProductAttributes {
  id: string,
  name: string,
  quantity: number,
  measureUnit: string,
}

export interface ProductCreationAttributes extends Optional<ProductAttributes, "id"> { }

interface ProductInstance extends Model<ProductAttributes, ProductCreationAttributes>, ProductAttributes { }

export const ProductModel = sequelize.define<ProductInstance>("Product", {
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
  quantity: {
    type: DataTypes.STRING(500),
    allowNull: false
  },
  measureUnit: {
    type: DataTypes.STRING(500),
    allowNull: false
  },
})