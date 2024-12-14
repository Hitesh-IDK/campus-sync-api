import express from 'express';
import { ActiveEndpointHandler, MethodNotAllowedHandler } from '../handlers/base-handler';
import addDepartmentHandler, { AddDepartmentBodyHandler } from '../handlers/department/add-department-handler';
import listDepartmentHandler from '../handlers/department/list-department-handler';
import updateDepartmentHandler, {
  UpdateDepartmentBodyValidator,
} from '../handlers/department/update-department-handler';
import showDepartmentHandler, { ShowDepartmentBodyHandler } from '../handlers/department/show-department-handler';
import deleteDepartmentHandler, { DeleteDepartmentBodyHandler } from '../handlers/department/delete-department-handler';
import { AuthorizedHeaderVerification } from '../middleware/header-verification';

const DepartmentRouter = express.Router();
export default DepartmentRouter;

DepartmentRouter.get('/', ActiveEndpointHandler).all('/', MethodNotAllowedHandler);
// DepartmentRouter.use(AuthorizedHeaderVerification);

DepartmentRouter.get('/list', listDepartmentHandler).all('/list', MethodNotAllowedHandler);

DepartmentRouter.get('/show/:id', ShowDepartmentBodyHandler, showDepartmentHandler).all(
  '/show/:id',
  MethodNotAllowedHandler
);

DepartmentRouter.post('/add', AddDepartmentBodyHandler, addDepartmentHandler).all('/add', MethodNotAllowedHandler);

DepartmentRouter.patch('/update', UpdateDepartmentBodyValidator, updateDepartmentHandler).all(
  '/update',
  MethodNotAllowedHandler
);

DepartmentRouter.delete('/delete', DeleteDepartmentBodyHandler, deleteDepartmentHandler).all(
  '/delete',
  MethodNotAllowedHandler
);
