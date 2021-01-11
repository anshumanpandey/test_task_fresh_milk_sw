import express from 'express';
import { productsRoutes } from './products.route';
import { recipesRoutes } from './recipes.route';
import { userRoutes } from './user.route';

export const routes = express();

routes.use("/user",userRoutes)
routes.use("/product",productsRoutes)
routes.use("/recipe",recipesRoutes)
