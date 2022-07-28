import { IUser } from 'app/entities/user/user.model';
import { IProductOrder } from 'app/entities/product-order/product-order.model';
import { Gender } from 'app/entities/enumerations/gender.model';

export interface ICustomer {
  id?: number;
  firstName?: string;
  lastName?: string;
  gender?: Gender;
  email?: string;
  phone?: string;
  addressLine1?: string;
  addressLine2?: string | null;
  city?: string;
  country?: string;
  user?: IUser | null;
  orders?: IProductOrder[] | null;
}

export class Customer implements ICustomer {
  constructor(
    public id?: number,
    public firstName?: string,
    public lastName?: string,
    public gender?: Gender,
    public email?: string,
    public phone?: string,
    public addressLine1?: string,
    public addressLine2?: string | null,
    public city?: string,
    public country?: string,
    public user?: IUser | null,
    public orders?: IProductOrder[] | null
  ) {}
}

export function getCustomerIdentifier(customer: ICustomer): number | undefined {
  return customer.id;
}
