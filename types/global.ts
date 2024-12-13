export type Status = 'ACTIVE' | 'INACTIVE';

export type AccountTypes = 'student' | 'instructor' | 'vendor' | 'department_spoc' | 'institution_spoc' | 'admin';

export interface GenericAPIResponse<T> {
  success: boolean;
  code: number;
  data: T;
}

export interface GenericAPIBody {
  message: string;
  error?: Errors;
}

export type Errors =
  | 'MISSING_FIELDS'
  | 'INVALID_REQUEST'
  | 'INVALID_ENDPOINT'
  | 'UNCAUGHT_ERROR'
  | 'QUERY_ERROR'
  | 'AUTHENTICATION_ERROR'
  | 'DOESNT_EXIST_ERROR'
  | 'INVALID_PARAMETERS';

/*
 * Request Headers
 */

export interface GenericReqHeaders {
  'x-api-key': string;
  'x-account-type': AccountTypes;
}

export interface VerifyReqHeaders extends GenericReqHeaders {
  'x-recover-token'?: string;
}

export interface AuthorizedReqHeaders extends GenericReqHeaders {
  'x-access-token': string;
  'x-account-id': string;
}

export interface RefreshReqHeaders extends GenericReqHeaders {
  'x-refresh-token': string;
  'x-account-id': string;
}
