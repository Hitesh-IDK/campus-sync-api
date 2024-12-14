import express from 'express';
import { ActiveEndpointHandler, MethodNotAllowedHandler } from '../handlers/base-handler';
import { AuthorizedHeaderVerification } from '../middleware/header-verification';
import bindDepartmentHandler, { BindDepartmentBodyValidator } from '../handlers/instructor/bind-department-handler';

const InstructorRouter = express.Router();
export default InstructorRouter;

InstructorRouter.get('/', ActiveEndpointHandler).all('/', MethodNotAllowedHandler);
// InstructorRouter.use(AuthorizedHeaderVerification);

InstructorRouter.post('/bind-department', BindDepartmentBodyValidator, bindDepartmentHandler).all(
  '/bind-department',
  MethodNotAllowedHandler
);
