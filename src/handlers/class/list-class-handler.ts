import { ListClassResBody } from '../../../types/class';
import { GenericAPIResponse } from '../../../types/global';
import Class from '../../database/models/class-model';
import Department from '../../database/models/department-model';
import { AppError, catchAsync } from '../../middleware/error-middleware';
import { Request, Response, NextFunction } from 'express';

export default catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params as { id: string };

  if (!id) {
    return next(new AppError('Missing required field: id', 'MISSING_FIELDS', 400));
  }

  const department = await Department.getById(id);
  if (!department) {
    return next(new AppError('Department not found, invalid ID', 'INVALID_PARAMETERS', 404));
  }

  const classes = await Class.getByIds(department.classes);
  const response: GenericAPIResponse<ListClassResBody> = {
    success: true,
    code: 200,
    data: {
      message: 'Classes retrieved successfully',
      classes,
    },
  };

  return res.status(response.code).json(response);
});
