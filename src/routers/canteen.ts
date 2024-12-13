import express from 'express';
import multer from 'multer';
import { ActiveEndpointHandler, MethodNotAllowedHandler } from '../handlers/base-handler';
import listCanteenItemsHandler from '../handlers/canteen/list-canteen-item-handler';
import updateCanteenItemHandler, {
  updateCanteenItemBodyValidator,
} from '../handlers/canteen/update-canteen-item-handler';
import deleteCanteenItemHandler, {
  deleteCanteenItemBodyValidator,
} from '../handlers/canteen/delete-canteen-item-handler';
import { AddCanteenItemBodyValidator, addCanteenItemHandler } from '../handlers/canteen/add-canteen-item-handler';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/images/canteen');
  },
  filename: function (req, file, cb) {
    const extArray = file.mimetype.split('/');
    const extension = extArray[extArray.length - 1];
    cb(null, file.fieldname + '-' + Date.now() + '.' + extension);
  },
});

const upload = multer({ storage: storage });

const CanteenRouter = express.Router();
export default CanteenRouter;

CanteenRouter.get('/', ActiveEndpointHandler).all('/', MethodNotAllowedHandler);

CanteenRouter.post('/add', upload.single('canteen_item'), AddCanteenItemBodyValidator, addCanteenItemHandler).all(
  '/add',
  MethodNotAllowedHandler
);

CanteenRouter.get('/list', listCanteenItemsHandler).all('/list', MethodNotAllowedHandler);

CanteenRouter.patch('/update', updateCanteenItemBodyValidator, updateCanteenItemHandler).all(
  '/update',
  MethodNotAllowedHandler
);

CanteenRouter.delete('/delete', deleteCanteenItemBodyValidator, deleteCanteenItemHandler).all(
  '/delete',
  MethodNotAllowedHandler
);
