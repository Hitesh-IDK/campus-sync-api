/*
 * Request Body
 */

export interface AddInstitutionReqBody {
  name: string;
  address: string;
  city: string;
  state: string;
  image?: string;

  handler: {
    registration_id: string;
    name: string;
    phone: number;
    email?: string;
  };
}

/*
 * Response Body
 */

/*
 * Database Body
 */
