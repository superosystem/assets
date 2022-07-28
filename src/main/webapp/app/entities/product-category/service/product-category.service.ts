import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IProductCategory, getProductCategoryIdentifier } from '../product-category.model';

export type EntityResponseType = HttpResponse<IProductCategory>;
export type EntityArrayResponseType = HttpResponse<IProductCategory[]>;

@Injectable({ providedIn: 'root' })
export class ProductCategoryService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/product-categories');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(productCategory: IProductCategory): Observable<EntityResponseType> {
    return this.http.post<IProductCategory>(this.resourceUrl, productCategory, { observe: 'response' });
  }

  update(productCategory: IProductCategory): Observable<EntityResponseType> {
    return this.http.put<IProductCategory>(
      `${this.resourceUrl}/${getProductCategoryIdentifier(productCategory) as number}`,
      productCategory,
      { observe: 'response' }
    );
  }

  partialUpdate(productCategory: IProductCategory): Observable<EntityResponseType> {
    return this.http.patch<IProductCategory>(
      `${this.resourceUrl}/${getProductCategoryIdentifier(productCategory) as number}`,
      productCategory,
      { observe: 'response' }
    );
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IProductCategory>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IProductCategory[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addProductCategoryToCollectionIfMissing(
    productCategoryCollection: IProductCategory[],
    ...productCategoriesToCheck: (IProductCategory | null | undefined)[]
  ): IProductCategory[] {
    const productCategories: IProductCategory[] = productCategoriesToCheck.filter(isPresent);
    if (productCategories.length > 0) {
      const productCategoryCollectionIdentifiers = productCategoryCollection.map(
        productCategoryItem => getProductCategoryIdentifier(productCategoryItem)!
      );
      const productCategoriesToAdd = productCategories.filter(productCategoryItem => {
        const productCategoryIdentifier = getProductCategoryIdentifier(productCategoryItem);
        if (productCategoryIdentifier == null || productCategoryCollectionIdentifiers.includes(productCategoryIdentifier)) {
          return false;
        }
        productCategoryCollectionIdentifiers.push(productCategoryIdentifier);
        return true;
      });
      return [...productCategoriesToAdd, ...productCategoryCollection];
    }
    return productCategoryCollection;
  }
}
