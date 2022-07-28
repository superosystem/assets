import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import dayjs from 'dayjs/esm';

import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { OrderStatus } from 'app/entities/enumerations/order-status.model';
import { IProductOrder, ProductOrder } from '../product-order.model';

import { ProductOrderService } from './product-order.service';

describe('ProductOrder Service', () => {
  let service: ProductOrderService;
  let httpMock: HttpTestingController;
  let elemDefault: IProductOrder;
  let expectedResult: IProductOrder | IProductOrder[] | boolean | null;
  let currentDate: dayjs.Dayjs;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(ProductOrderService);
    httpMock = TestBed.inject(HttpTestingController);
    currentDate = dayjs();

    elemDefault = {
      id: 0,
      placedDate: currentDate,
      status: OrderStatus.COMPLETED,
      code: 'AAAAAAA',
    };
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = Object.assign(
        {
          placedDate: currentDate.format(DATE_TIME_FORMAT),
        },
        elemDefault
      );

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(elemDefault);
    });

    it('should create a ProductOrder', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
          placedDate: currentDate.format(DATE_TIME_FORMAT),
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          placedDate: currentDate,
        },
        returnedFromService
      );

      service.create(new ProductOrder()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a ProductOrder', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          placedDate: currentDate.format(DATE_TIME_FORMAT),
          status: 'BBBBBB',
          code: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          placedDate: currentDate,
        },
        returnedFromService
      );

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a ProductOrder', () => {
      const patchObject = Object.assign(
        {
          status: 'BBBBBB',
          code: 'BBBBBB',
        },
        new ProductOrder()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign(
        {
          placedDate: currentDate,
        },
        returnedFromService
      );

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of ProductOrder', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          placedDate: currentDate.format(DATE_TIME_FORMAT),
          status: 'BBBBBB',
          code: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          placedDate: currentDate,
        },
        returnedFromService
      );

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toContainEqual(expected);
    });

    it('should delete a ProductOrder', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addProductOrderToCollectionIfMissing', () => {
      it('should add a ProductOrder to an empty array', () => {
        const productOrder: IProductOrder = { id: 123 };
        expectedResult = service.addProductOrderToCollectionIfMissing([], productOrder);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(productOrder);
      });

      it('should not add a ProductOrder to an array that contains it', () => {
        const productOrder: IProductOrder = { id: 123 };
        const productOrderCollection: IProductOrder[] = [
          {
            ...productOrder,
          },
          { id: 456 },
        ];
        expectedResult = service.addProductOrderToCollectionIfMissing(productOrderCollection, productOrder);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a ProductOrder to an array that doesn't contain it", () => {
        const productOrder: IProductOrder = { id: 123 };
        const productOrderCollection: IProductOrder[] = [{ id: 456 }];
        expectedResult = service.addProductOrderToCollectionIfMissing(productOrderCollection, productOrder);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(productOrder);
      });

      it('should add only unique ProductOrder to an array', () => {
        const productOrderArray: IProductOrder[] = [{ id: 123 }, { id: 456 }, { id: 72456 }];
        const productOrderCollection: IProductOrder[] = [{ id: 123 }];
        expectedResult = service.addProductOrderToCollectionIfMissing(productOrderCollection, ...productOrderArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const productOrder: IProductOrder = { id: 123 };
        const productOrder2: IProductOrder = { id: 456 };
        expectedResult = service.addProductOrderToCollectionIfMissing([], productOrder, productOrder2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(productOrder);
        expect(expectedResult).toContain(productOrder2);
      });

      it('should accept null and undefined values', () => {
        const productOrder: IProductOrder = { id: 123 };
        expectedResult = service.addProductOrderToCollectionIfMissing([], null, productOrder, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(productOrder);
      });

      it('should return initial array if no ProductOrder is added', () => {
        const productOrderCollection: IProductOrder[] = [{ id: 123 }];
        expectedResult = service.addProductOrderToCollectionIfMissing(productOrderCollection, undefined, null);
        expect(expectedResult).toEqual(productOrderCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
