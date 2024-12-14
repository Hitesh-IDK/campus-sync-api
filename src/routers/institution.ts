import express from 'express';
import listInstitutionHandler from '../handlers/institution/list-institution-handler';
import { MethodNotAllowedHandler } from '../handlers/base-handler';
import addInstitutionHandler, { AddInstitutionBodyValidator } from '../handlers/institution/add-institution-handler';

const InstitutionRouter = express.Router();
export default InstitutionRouter;

InstitutionRouter.get('/list', listInstitutionHandler).all('/list', MethodNotAllowedHandler);

InstitutionRouter.post('/add', AddInstitutionBodyValidator, addInstitutionHandler).all('/add', MethodNotAllowedHandler);
