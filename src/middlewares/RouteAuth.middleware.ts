var jwt = require('express-jwt');

export const RouteAuth = () => jwt({ secret: process.env.JWT_SECRET || 'aa', algorithms: ['HS256'] })