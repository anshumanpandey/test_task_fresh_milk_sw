import express from 'express';
var jwt = require('express-jwt');
import asyncHandler from "express-async-handler"
import { checkSchema } from "express-validator"
import { RouteAuth } from '../middlewares';
import { validateParams } from '../middlewares/RouteValidation.middleware';
import { MeasureUnitsArr, ProductCreationAttributes, ProductModel } from '../models/Product.model';

export const productsRoutes = express();

productsRoutes.get('/get', RouteAuth(), asyncHandler(async (req, res) => {
  const recipes = await ProductModel.findAll({
    //@ts-expect-error
    where: { UserId: req.user.id },
    attributes: { exclude: ["UserId"] },
  })

  res.send(recipes);
}));

productsRoutes.post('/create', RouteAuth(),validateParams(checkSchema({
  "*.name": {
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
  "*.quantity": {
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
  "*.measureUnit": {
    in: ['body'],
    exists: {
      errorMessage: 'Missing field'
    },
    isEmpty: {
      errorMessage: 'Missing field',
      negated: true
    },
    isIn: {
      options: [MeasureUnitsArr],
      errorMessage: `Invalid Measure Unit. Must be one of ${MeasureUnitsArr.join(", ")}`
    },
    trim: true
  },
})), asyncHandler(async (req, res) => {
  //@ts-expect-error
  const p = await ProductModel.bulkCreate(req.body.map((p: ProductCreationAttributes) => ({ ...p, UserId: req.user.id})));

  res.send(p.map(p => p.toJSON()));
}));

productsRoutes.put('/update', RouteAuth(),validateParams(checkSchema({
  id: {
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
  name: {
    in: ['body'],
    exists: {
      errorMessage: 'Missing field'
    },
    isEmpty: {
      errorMessage: 'Missing field',
      negated: true
    },
    optional: { options: { nullable: true } },
    trim: true
  },
  quantity: {
    in: ['body'],
    exists: {
      errorMessage: 'Missing field'
    },
    isEmpty: {
      errorMessage: 'Missing field',
      negated: true
    },
    optional: { options: { nullable: true } },
    trim: true
  },
  measureUnit: {
    in: ['body'],
    exists: {
      errorMessage: 'Missing field'
    },
    isEmpty: {
      errorMessage: 'Missing field',
      negated: true
    },
    isIn: {
      options: [MeasureUnitsArr],
      errorMessage: `Invalid Measure Unit. Must be one of ${MeasureUnitsArr.join(", ")}`
    },
    optional: { options: { nullable: true } },
    trim: true
  }})), asyncHandler(async (req, res) => {
  const { id, ...newData } = req.body
  await ProductModel.update(newData, { where: { id } });

  res.send({ "success": "Product Update" });
}));
