import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IShipment, getShipmentIdentifier } from '../shipment.model';

export type EntityResponseType = HttpResponse<IShipment>;
export type EntityArrayResponseType = HttpResponse<IShipment[]>;

@Injectable({ providedIn: 'root' })
export class ShipmentService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/shipments');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(shipment: IShipment): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(shipment);
    return this.http
      .post<IShipment>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(shipment: IShipment): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(shipment);
    return this.http
      .put<IShipment>(`${this.resourceUrl}/${getShipmentIdentifier(shipment) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(shipment: IShipment): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(shipment);
    return this.http
      .patch<IShipment>(`${this.resourceUrl}/${getShipmentIdentifier(shipment) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IShipment>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IShipment[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addShipmentToCollectionIfMissing(shipmentCollection: IShipment[], ...shipmentsToCheck: (IShipment | null | undefined)[]): IShipment[] {
    const shipments: IShipment[] = shipmentsToCheck.filter(isPresent);
    if (shipments.length > 0) {
      const shipmentCollectionIdentifiers = shipmentCollection.map(shipmentItem => getShipmentIdentifier(shipmentItem)!);
      const shipmentsToAdd = shipments.filter(shipmentItem => {
        const shipmentIdentifier = getShipmentIdentifier(shipmentItem);
        if (shipmentIdentifier == null || shipmentCollectionIdentifiers.includes(shipmentIdentifier)) {
          return false;
        }
        shipmentCollectionIdentifiers.push(shipmentIdentifier);
        return true;
      });
      return [...shipmentsToAdd, ...shipmentCollection];
    }
    return shipmentCollection;
  }

  protected convertDateFromClient(shipment: IShipment): IShipment {
    return Object.assign({}, shipment, {
      date: shipment.date?.isValid() ? shipment.date.toJSON() : undefined,
    });
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.date = res.body.date ? dayjs(res.body.date) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((shipment: IShipment) => {
        shipment.date = shipment.date ? dayjs(shipment.date) : undefined;
      });
    }
    return res;
  }
}
