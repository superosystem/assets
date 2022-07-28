import dayjs from 'dayjs/esm';
import { IOrderItem } from 'app/entities/order-item/order-item.model';
import { IInvoice } from 'app/entities/invoice/invoice.model';
import { ICustomer } from 'app/entities/customer/customer.model';
import { OrderStatus } from 'app/entities/enumerations/order-status.model';

export interface IProductOrder {
  id?: number;
  placedDate?: dayjs.Dayjs;
  status?: OrderStatus;
  code?: string;
  orderItems?: IOrderItem[] | null;
  invoices?: IInvoice[] | null;
  customer?: ICustomer | null;
}

export class ProductOrder implements IProductOrder {
  constructor(
    public id?: number,
    public placedDate?: dayjs.Dayjs,
    public status?: OrderStatus,
    public code?: string,
    public orderItems?: IOrderItem[] | null,
    public invoices?: IInvoice[] | null,
    public customer?: ICustomer | null
  ) {}
}

export function getProductOrderIdentifier(productOrder: IProductOrder): number | undefined {
  return productOrder.id;
}
