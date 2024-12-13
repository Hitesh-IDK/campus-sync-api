import { ShowDepartmentResBody } from '../../../types/department';
import { GenericAPIResponse } from '../../../types/global';
import Department from '../../database/models/department-model';
import { AppError, catchAsync } from '../../middleware/error-middleware';
import { Request, Response, NextFunction } from 'express';

export default catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params as { id: string };

  const department = await Department.getById(id);
  if (!department) {
    return next(new AppError('Department not found', 'INVALID_PARAMETERS', 404));
  }

  const response: GenericAPIResponse<ShowDepartmentResBody> = {
    success: true,
    code: 200,
    data: {
      message: 'Department retrieved successfully',
      department: await department.toJavaScriptObject(),
    },
  };

  return res.status(response.code).json(response);
});

export const ShowDepartmentBodyHandler = (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params as { id: string };

  if (!id) {
    return next(new AppError('Missing required field: id', 'MISSING_FIELDS', 400));
  }

  next();
};
