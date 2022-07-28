import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ICustomer, getCustomerIdentifier } from '../customer.model';

export type EntityResponseType = HttpResponse<ICustomer>;
export type EntityArrayResponseType = HttpResponse<ICustomer[]>;

@Injectable({ providedIn: 'root' })
export class CustomerService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/customers');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(customer: ICustomer): Observable<EntityResponseType> {
    return this.http.post<ICustomer>(this.resourceUrl, customer, { observe: 'response' });
  }

  update(customer: ICustomer): Observable<EntityResponseType> {
    return this.http.put<ICustomer>(`${this.resourceUrl}/${getCustomerIdentifier(customer) as number}`, customer, { observe: 'response' });
  }

  partialUpdate(customer: ICustomer): Observable<EntityResponseType> {
    return this.http.patch<ICustomer>(`${this.resourceUrl}/${getCustomerIdentifier(customer) as number}`, customer, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ICustomer>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ICustomer[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addCustomerToCollectionIfMissing(customerCollection: ICustomer[], ...customersToCheck: (ICustomer | null | undefined)[]): ICustomer[] {
    const customers: ICustomer[] = customersToCheck.filter(isPresent);
    if (customers.length > 0) {
      const customerCollectionIdentifiers = customerCollection.map(customerItem => getCustomerIdentifier(customerItem)!);
      const customersToAdd = customers.filter(customerItem => {
        const customerIdentifier = getCustomerIdentifier(customerItem);
        if (customerIdentifier == null || customerCollectionIdentifiers.includes(customerIdentifier)) {
          return false;
        }
        customerCollectionIdentifiers.push(customerIdentifier);
        return true;
      });
      return [...customersToAdd, ...customerCollection];
    }
    return customerCollection;
  }
}
