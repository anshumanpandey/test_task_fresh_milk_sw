import express from 'express';
import asyncHandler from "express-async-handler"
import { checkSchema } from "express-validator"
import { sign } from 'jsonwebtoken'
import { hash, compare } from "bcrypt"
import { UserModel } from '../models/user.model';
import { validateParams } from '../middlewares/RouteValidation.middleware';
import { ApiError } from '../utils/ApiError';
import { RouteAuth } from '../middlewares';

export const userRoutes = express();

userRoutes.post('/login', validateParams(checkSchema({
  nickname: {
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
  password: {
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
  const { nickname, password } = req.body;
  const user = await UserModel.findOne({
    where: { nickname },
    attributes: { exclude: ["createdAt", "updatedAt"] }
  });

  if (!user) throw new ApiError("User not found")
  if (!await compare(password, user.password)) throw new ApiError("Email or password incorrect")

  await user.update({ isLogged: true })
  const jsonData = user.toJSON();
  //@ts-ignore
  delete jsonData.password;
  var token = sign(jsonData, process.env.JWT_SECRET || 'aa', { expiresIn: '9999 years' });
  res.send({ ...jsonData, token });
}));

userRoutes.post('/register', validateParams(checkSchema({
  nickname: {
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
  password: {
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
  confirmPassword: {
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
  emailAddress: {
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
  const { password, confirmPassword, emailAddress, nickname, ...fields } = req.body;

  if (password != confirmPassword) throw new ApiError("Password not match")

  const [ byEmail, byNickname] = await Promise.all([
    await UserModel.findOne({ where: { emailAddress } }),
    await UserModel.findOne({ where: { nickname } }),
  ])
  if (byEmail) throw new ApiError("Email already registered")
  if (byNickname) throw new ApiError("Nickname already registered")

  const hashedPass = await hash(password, 8)
  const user = await UserModel.create({ password: hashedPass, nickname,emailAddress, ...fields })

  const jsonData = user.toJSON();
  //@ts-ignore
  delete jsonData.password;
  var token = sign(jsonData, process.env.JWT_SECRET || 'aa', { expiresIn: '9999 years' });
  res.send({ ...jsonData, token });
}));
