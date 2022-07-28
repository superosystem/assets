import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ICustomer, Customer } from '../customer.model';
import { CustomerService } from '../service/customer.service';

@Injectable({ providedIn: 'root' })
export class CustomerRoutingResolveService implements Resolve<ICustomer> {
  constructor(protected service: CustomerService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ICustomer> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((customer: HttpResponse<Customer>) => {
          if (customer.body) {
            return of(customer.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Customer());
  }
}
