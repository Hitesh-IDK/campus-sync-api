import express from 'express';
import { ActiveEndpointHandler, MethodNotAllowedHandler } from '../handlers/base-handler';
import refreshHandler, { RefreshBodyValidator } from '../handlers/user/refresh-handler';
import { AuthorizedHeaderVerification, RefreshHeaderVerification } from '../middleware/header-verification';
import { ListUsersBodyValidator, listUsersHandler } from '../handlers/user/list-users-handler';

const UserRouter = express.Router();
export default UserRouter;

UserRouter.get('/', ActiveEndpointHandler).all('/', MethodNotAllowedHandler);

UserRouter.use('/list/:account_type', AuthorizedHeaderVerification, ListUsersBodyValidator, listUsersHandler).all(
  '/list/:account_type',
  MethodNotAllowedHandler
);

UserRouter.post('/refresh', RefreshHeaderVerification, RefreshBodyValidator, refreshHandler).all(
  '/',
  MethodNotAllowedHandler
);
