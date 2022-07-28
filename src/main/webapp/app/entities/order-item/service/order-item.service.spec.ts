import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { OrderItemStatus } from 'app/entities/enumerations/order-item-status.model';
import { IOrderItem, OrderItem } from '../order-item.model';

import { OrderItemService } from './order-item.service';

describe('OrderItem Service', () => {
  let service: OrderItemService;
  let httpMock: HttpTestingController;
  let elemDefault: IOrderItem;
  let expectedResult: IOrderItem | IOrderItem[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(OrderItemService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      quantity: 0,
      totalPrice: 0,
      status: OrderItemStatus.AVAILABLE,
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

    it('should create a OrderItem', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new OrderItem()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a OrderItem', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          quantity: 1,
          totalPrice: 1,
          status: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a OrderItem', () => {
      const patchObject = Object.assign(
        {
          quantity: 1,
          totalPrice: 1,
          status: 'BBBBBB',
        },
        new OrderItem()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of OrderItem', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          quantity: 1,
          totalPrice: 1,
          status: 'BBBBBB',
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

    it('should delete a OrderItem', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addOrderItemToCollectionIfMissing', () => {
      it('should add a OrderItem to an empty array', () => {
        const orderItem: IOrderItem = { id: 123 };
        expectedResult = service.addOrderItemToCollectionIfMissing([], orderItem);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(orderItem);
      });

      it('should not add a OrderItem to an array that contains it', () => {
        const orderItem: IOrderItem = { id: 123 };
        const orderItemCollection: IOrderItem[] = [
          {
            ...orderItem,
          },
          { id: 456 },
        ];
        expectedResult = service.addOrderItemToCollectionIfMissing(orderItemCollection, orderItem);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a OrderItem to an array that doesn't contain it", () => {
        const orderItem: IOrderItem = { id: 123 };
        const orderItemCollection: IOrderItem[] = [{ id: 456 }];
        expectedResult = service.addOrderItemToCollectionIfMissing(orderItemCollection, orderItem);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(orderItem);
      });

      it('should add only unique OrderItem to an array', () => {
        const orderItemArray: IOrderItem[] = [{ id: 123 }, { id: 456 }, { id: 47238 }];
        const orderItemCollection: IOrderItem[] = [{ id: 123 }];
        expectedResult = service.addOrderItemToCollectionIfMissing(orderItemCollection, ...orderItemArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const orderItem: IOrderItem = { id: 123 };
        const orderItem2: IOrderItem = { id: 456 };
        expectedResult = service.addOrderItemToCollectionIfMissing([], orderItem, orderItem2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(orderItem);
        expect(expectedResult).toContain(orderItem2);
      });

      it('should accept null and undefined values', () => {
        const orderItem: IOrderItem = { id: 123 };
        expectedResult = service.addOrderItemToCollectionIfMissing([], null, orderItem, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(orderItem);
      });

      it('should return initial array if no OrderItem is added', () => {
        const orderItemCollection: IOrderItem[] = [{ id: 123 }];
        expectedResult = service.addOrderItemToCollectionIfMissing(orderItemCollection, undefined, null);
        expect(expectedResult).toEqual(orderItemCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
