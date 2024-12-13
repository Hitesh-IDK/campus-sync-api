import express from 'express';
import uploadImageHandler from '../handlers/image/upload-image-handler';
import { MethodNotAllowedHandler } from '../handlers/base-handler';
import multer from 'multer';

const ImageRouter = express.Router();
export default ImageRouter;

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/images/temp');
  },
  filename: function (req, file, cb) {
    const extArray = file.mimetype.split('/');
    const extension = extArray[extArray.length - 1];
    cb(null, file.fieldname + '-' + Date.now() + '.' + extension);
  },
});

const upload = multer({ storage: storage });

ImageRouter.post('/upload', upload.single('image'), uploadImageHandler).all('/upload', MethodNotAllowedHandler);
