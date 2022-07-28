import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IProductCategory, ProductCategory } from '../product-category.model';

import { ProductCategoryService } from './product-category.service';

describe('ProductCategory Service', () => {
  let service: ProductCategoryService;
  let httpMock: HttpTestingController;
  let elemDefault: IProductCategory;
  let expectedResult: IProductCategory | IProductCategory[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(ProductCategoryService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      name: 'AAAAAAA',
      description: 'AAAAAAA',
    };
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = Object.assign({}, elemDefault);

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(elemDefault);
    });

    it('should create a ProductCategory', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new ProductCategory()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a ProductCategory', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          name: 'BBBBBB',
          description: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a ProductCategory', () => {
      const patchObject = Object.assign(
        {
          name: 'BBBBBB',
          description: 'BBBBBB',
        },
        new ProductCategory()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of ProductCategory', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          name: 'BBBBBB',
          description: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toContainEqual(expected);
    });

    it('should delete a ProductCategory', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addProductCategoryToCollectionIfMissing', () => {
      it('should add a ProductCategory to an empty array', () => {
        const productCategory: IProductCategory = { id: 123 };
        expectedResult = service.addProductCategoryToCollectionIfMissing([], productCategory);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(productCategory);
      });

      it('should not add a ProductCategory to an array that contains it', () => {
        const productCategory: IProductCategory = { id: 123 };
        const productCategoryCollection: IProductCategory[] = [
          {
            ...productCategory,
          },
          { id: 456 },
        ];
        expectedResult = service.addProductCategoryToCollectionIfMissing(productCategoryCollection, productCategory);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a ProductCategory to an array that doesn't contain it", () => {
        const productCategory: IProductCategory = { id: 123 };
        const productCategoryCollection: IProductCategory[] = [{ id: 456 }];
        expectedResult = service.addProductCategoryToCollectionIfMissing(productCategoryCollection, productCategory);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(productCategory);
      });

      it('should add only unique ProductCategory to an array', () => {
        const productCategoryArray: IProductCategory[] = [{ id: 123 }, { id: 456 }, { id: 15278 }];
        const productCategoryCollection: IProductCategory[] = [{ id: 123 }];
        expectedResult = service.addProductCategoryToCollectionIfMissing(productCategoryCollection, ...productCategoryArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const productCategory: IProductCategory = { id: 123 };
        const productCategory2: IProductCategory = { id: 456 };
        expectedResult = service.addProductCategoryToCollectionIfMissing([], productCategory, productCategory2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(productCategory);
        expect(expectedResult).toContain(productCategory2);
      });

      it('should accept null and undefined values', () => {
        const productCategory: IProductCategory = { id: 123 };
        expectedResult = service.addProductCategoryToCollectionIfMissing([], null, productCategory, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(productCategory);
      });

      it('should return initial array if no ProductCategory is added', () => {
        const productCategoryCollection: IProductCategory[] = [{ id: 123 }];
        expectedResult = service.addProductCategoryToCollectionIfMissing(productCategoryCollection, undefined, null);
        expect(expectedResult).toEqual(productCategoryCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
