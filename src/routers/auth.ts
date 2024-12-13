import express from 'express';
import { ActiveEndpointHandler, MethodNotAllowedHandler } from '../handlers/base-handler';
import registerHandler, { RegisterBodyValidator } from '../handlers/auth/register-handler';
import { AuthorizedHeaderVerification } from '../middleware/header-verification';
import loginHandler, { LoginBodyValidator } from '../handlers/auth/login-handler';

export const AuthRouter = express.Router();

AuthRouter.get('/', ActiveEndpointHandler).all('/', MethodNotAllowedHandler);

AuthRouter.post('/login', LoginBodyValidator, loginHandler).all('/', MethodNotAllowedHandler);

AuthRouter.post('/register', AuthorizedHeaderVerification, RegisterBodyValidator, registerHandler).all(
  '/register',
  MethodNotAllowedHandler
);
