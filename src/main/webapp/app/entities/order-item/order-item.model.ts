import { IProduct } from 'app/entities/product/product.model';
import { IProductOrder } from 'app/entities/product-order/product-order.model';
import { OrderItemStatus } from 'app/entities/enumerations/order-item-status.model';

export interface IOrderItem {
  id?: number;
  quantity?: number;
  totalPrice?: number;
  status?: OrderItemStatus;
  product?: IProduct | null;
  order?: IProductOrder | null;
}

export class OrderItem implements IOrderItem {
  constructor(
    public id?: number,
    public quantity?: number,
    public totalPrice?: number,
    public status?: OrderItemStatus,
    public product?: IProduct | null,
    public order?: IProductOrder | null
  ) {}
}

export function getOrderItemIdentifier(orderItem: IOrderItem): number | undefined {
  return orderItem.id;
}
