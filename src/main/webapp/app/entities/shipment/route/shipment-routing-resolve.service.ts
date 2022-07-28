import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IShipment, Shipment } from '../shipment.model';
import { ShipmentService } from '../service/shipment.service';

@Injectable({ providedIn: 'root' })
export class ShipmentRoutingResolveService implements Resolve<IShipment> {
  constructor(protected service: ShipmentService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IShipment> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((shipment: HttpResponse<Shipment>) => {
          if (shipment.body) {
            return of(shipment.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Shipment());
  }
}
