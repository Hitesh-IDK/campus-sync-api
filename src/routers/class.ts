import express from 'express';
import { ActiveEndpointHandler, MethodNotAllowedHandler } from '../handlers/base-handler';
import { AuthorizedHeaderVerification } from '../middleware/header-verification';
import addClassHandler, { AddClassBodyValidator } from '../handlers/class/add-class-handler';
import listClassHandler from '../handlers/class/list-class-handler';

const ClassRouter = express.Router();
export default ClassRouter;

ClassRouter.get('/', ActiveEndpointHandler).all('/', MethodNotAllowedHandler);
// ClassRouter.use(AuthorizedHeaderVerification);

ClassRouter.get('/list/:id', listClassHandler).all('/list', MethodNotAllowedHandler);

ClassRouter.post('/add', AddClassBodyValidator, addClassHandler).all('/add', MethodNotAllowedHandler);
