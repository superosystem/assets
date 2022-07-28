import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IOrderItem, OrderItem } from '../order-item.model';
import { OrderItemService } from '../service/order-item.service';

@Injectable({ providedIn: 'root' })
export class OrderItemRoutingResolveService implements Resolve<IOrderItem> {
  constructor(protected service: OrderItemService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IOrderItem> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((orderItem: HttpResponse<OrderItem>) => {
          if (orderItem.body) {
            return of(orderItem.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new OrderItem());
  }
}
