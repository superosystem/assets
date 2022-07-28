import dayjs from 'dayjs/esm';
import { IInvoice } from 'app/entities/invoice/invoice.model';

export interface IShipment {
  id?: number;
  trackingCode?: string | null;
  date?: dayjs.Dayjs;
  details?: string | null;
  invoice?: IInvoice | null;
}

export class Shipment implements IShipment {
  constructor(
    public id?: number,
    public trackingCode?: string | null,
    public date?: dayjs.Dayjs,
    public details?: string | null,
    public invoice?: IInvoice | null
  ) {}
}

export function getShipmentIdentifier(shipment: IShipment): number | undefined {
  return shipment.id;
}
