import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IInvoice, Invoice } from '../invoice.model';
import { InvoiceService } from '../service/invoice.service';

@Injectable({ providedIn: 'root' })
export class InvoiceRoutingResolveService implements Resolve<IInvoice> {
  constructor(protected service: InvoiceService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IInvoice> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((invoice: HttpResponse<Invoice>) => {
          if (invoice.body) {
            return of(invoice.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Invoice());
  }
}
