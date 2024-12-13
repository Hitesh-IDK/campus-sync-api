import { DeleteDepartmentReqBody } from '../../../types/department';
import { GenericAPIBody, GenericAPIResponse } from '../../../types/global';
import Department from '../../database/models/department-model';
import { AppError, catchAsync } from '../../middleware/error-middleware';
import { Request, Response, NextFunction } from 'express';

export default catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.body as DeleteDepartmentReqBody;

  const department = await Department.getById(id);
  if (!department) {
    return next(new AppError('Department not found', 'INVALID_PARAMETERS', 404));
  }

  await department.delete();

  const response: GenericAPIResponse<GenericAPIBody> = {
    success: true,
    code: 200,
    data: {
      message: 'Department deleted successfully',
    },
  };

  return res.status(response.code).json(response);
});

export const DeleteDepartmentBodyHandler = (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.body as DeleteDepartmentReqBody;

  if (!id) {
    return next(new AppError('Missing required field: id', 'MISSING_FIELDS', 400));
  }

  next();
};
