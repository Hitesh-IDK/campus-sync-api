import { GenericAPIResponse } from '../../../types/global';
import { UploadImageResBody } from '../../../types/image';
import { AppError, catchAsync } from '../../middleware/error-middleware';
import { Request, Response, NextFunction } from 'express';

export default catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  if (!req.file) {
    return next(new AppError('Missing required field: file', 'MISSING_FIELDS', 400));
  }

  const baseURL = process.env.image_base_URL;
  const photo = `${baseURL}/temp/${req.file.filename}`;

  const response: GenericAPIResponse<UploadImageResBody> = {
    success: true,
    code: 200,
    data: {
      message: 'Image uploaded successfully',
      url: photo,
    },
  };

  return res.status(response.code).json(response);
});
