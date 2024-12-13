import express from 'express';
import { ActiveEndpointHandler, MethodNotAllowedHandler } from '../handlers/base-handler';
import { listVendorItemsHandler } from '../handlers/vendor/list-vendor-items-handler';
import { AddVendorItemBodyValidator, addVendorItemHandler } from '../handlers/vendor/add-vendor-item-handler';
import { deleteVendorItemHandler } from '../handlers/vendor/delete-vendor-item-handler';
import { UpdateVendorItemBodyValidator, updateVendorItemHandler } from '../handlers/vendor/update-vendor-item-handler';
import multer from 'multer';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/images/vendor');
  },
  filename: function (req, file, cb) {
    const extArray = file.mimetype.split('/');
    const extension = extArray[extArray.length - 1];
    cb(null, file.fieldname + '-' + Date.now() + '.' + extension);
  },
});

const upload = multer({ storage: storage });

const VendorRouter = express.Router();
export default VendorRouter;

VendorRouter.get('/', ActiveEndpointHandler).all('/', MethodNotAllowedHandler);

VendorRouter.get('/list/:vendorId', listVendorItemsHandler).all('/list:vendorId', MethodNotAllowedHandler);

VendorRouter.post('/add', upload.single('vendor_item'), AddVendorItemBodyValidator, addVendorItemHandler).all(
  '/add',
  MethodNotAllowedHandler
);

VendorRouter.delete('/delete', deleteVendorItemHandler, deleteVendorItemHandler).all(
  '/delete',
  MethodNotAllowedHandler
);

VendorRouter.patch('/update', upload.single('vendor_item'), UpdateVendorItemBodyValidator, updateVendorItemHandler).all(
  '/update',
  MethodNotAllowedHandler
);
