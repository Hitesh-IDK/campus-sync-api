import { ListDepartmentResBody } from '../../../types/department';
import { GenericAPIResponse } from '../../../types/global';
import Department from '../../database/models/department-model';
import { catchAsync } from '../../middleware/error-middleware';
import { Request, Response, NextFunction } from 'express';

export default catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const departments = await Department.getAll();

  // const aiMessage = await PromptAI(`Departments: ${JSON.stringify(departments)}`);

  const response: GenericAPIResponse<ListDepartmentResBody> = {
    success: true,
    code: 200,
    data: {
      message: 'List of Departments',
      departments: departments,
    },
  };

  return res.status(response.code).json(response);
});
