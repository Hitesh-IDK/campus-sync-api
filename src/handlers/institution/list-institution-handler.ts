import { GenericAPIResponse } from '../../../types/global';
import { ListInstitutionResBody } from '../../../types/institution';
import Institution from '../../database/models/institution-model';
import { catchAsync } from '../../middleware/error-middleware';
import { Request, Response, NextFunction } from 'express';

export default catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const institutions = await Institution.getAll();

  const response: GenericAPIResponse<ListInstitutionResBody> = {
    success: true,
    code: 200,
    data: {
      message: 'List of Institutions',
      institutions: institutions,
    },
  };

  return res.status(response.code).json(response);
});
