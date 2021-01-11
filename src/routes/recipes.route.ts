import express from 'express';
var jwt = require('express-jwt');
import asyncHandler from "express-async-handler"
import { checkSchema } from "express-validator"
import { RouteAuth } from '../middlewares';
import { validateParams } from '../middlewares/RouteValidation.middleware';
import { MeasureUnitsArr, ProductCreationAttributes, ProductModel } from '../models/Product.model';
import { RecipeModel, RecipeToProduct } from '../models/Recipe.model';
import { ApiError } from '../utils/ApiError';
import sequelize from '../utils/DB';

export const recipesRoutes = express();

recipesRoutes.get('/get', RouteAuth(), asyncHandler(async (req, res) => {
  const recipes = await RecipeModel.findAll({
    //@ts-expect-error
    where: { UserId: req.user.id },
    attributes: { exclude: ["UserId"] },
    include: [{ model: ProductModel, attributes: [ "name", "id" ], through: { attributes: [ "quantity"] } }]
  })

  res.send(recipes);
}));


recipesRoutes.post('/create', RouteAuth(), validateParams(checkSchema({
  name: {
    in: ['body'],
    exists: {
      errorMessage: 'Missing field'
    },
    isEmpty: {
      errorMessage: 'Missing field',
      negated: true
    },
    trim: true
  },
  "products.*.id": {
    in: ['body'],
    exists: {
      errorMessage: 'Missing field'
    },
    isEmpty: {
      errorMessage: 'Missing field',
      negated: true
    },
    trim: true
  },
  "products.*.quantity": {
    in: ['body'],
    exists: {
      errorMessage: 'Missing field'
    },
    isEmpty: {
      errorMessage: 'Missing field',
      negated: true
    },
    trim: true
  },
})), asyncHandler(async (req, res) => {
  const { name, products } = req.body

  await sequelize.transaction(async (transaction) => {

    const [recipe, productsToAdd] = await Promise.all([
      //@ts-expect-error
      RecipeModel.create({ name, UserId: req.user.id }, { transaction }),
      ProductModel.findAll({ where: { id: products.map((p: ProductCreationAttributes) => p.id) }, transaction }),
    ])

    const productsForRecipe = await Promise.all(productsToAdd
      .map(async product => {
        const productSend = products.find((p: ProductCreationAttributes) => p.id == product.id)
        const newQuantity = product.quantity - productSend.quantity
        if (newQuantity < 0) throw new ApiError(`Not enough ${product.name} to create the recipe`)

        await product.update({ quantity: newQuantity }, { transaction })
        
        return {
          RecipeId: recipe.id,
          ProductId: product.id,
          quantity: newQuantity
        }
      }))

    await RecipeToProduct.bulkCreate(productsForRecipe, { transaction })

    res.send({ "success": "Recipe Created" });
  });

}));
