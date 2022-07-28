import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { Gender } from 'app/entities/enumerations/gender.model';
import { ICustomer, Customer } from '../customer.model';

import { CustomerService } from './customer.service';

describe('Customer Service', () => {
  let service: CustomerService;
  let httpMock: HttpTestingController;
  let elemDefault: ICustomer;
  let expectedResult: ICustomer | ICustomer[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(CustomerService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      firstName: 'AAAAAAA',
      lastName: 'AAAAAAA',
      gender: Gender.MALE,
      email: 'AAAAAAA',
      phone: 'AAAAAAA',
      addressLine1: 'AAAAAAA',
      addressLine2: 'AAAAAAA',
      city: 'AAAAAAA',
      country: 'AAAAAAA',
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

    it('should create a Customer', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new Customer()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Customer', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          firstName: 'BBBBBB',
          lastName: 'BBBBBB',
          gender: 'BBBBBB',
          email: 'BBBBBB',
          phone: 'BBBBBB',
          addressLine1: 'BBBBBB',
          addressLine2: 'BBBBBB',
          city: 'BBBBBB',
          country: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Customer', () => {
      const patchObject = Object.assign(
        {
          firstName: 'BBBBBB',
          gender: 'BBBBBB',
          phone: 'BBBBBB',
          addressLine1: 'BBBBBB',
          country: 'BBBBBB',
        },
        new Customer()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Customer', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          firstName: 'BBBBBB',
          lastName: 'BBBBBB',
          gender: 'BBBBBB',
          email: 'BBBBBB',
          phone: 'BBBBBB',
          addressLine1: 'BBBBBB',
          addressLine2: 'BBBBBB',
          city: 'BBBBBB',
          country: 'BBBBBB',
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

    it('should delete a Customer', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addCustomerToCollectionIfMissing', () => {
      it('should add a Customer to an empty array', () => {
        const customer: ICustomer = { id: 123 };
        expectedResult = service.addCustomerToCollectionIfMissing([], customer);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(customer);
      });

      it('should not add a Customer to an array that contains it', () => {
        const customer: ICustomer = { id: 123 };
        const customerCollection: ICustomer[] = [
          {
            ...customer,
          },
          { id: 456 },
        ];
        expectedResult = service.addCustomerToCollectionIfMissing(customerCollection, customer);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Customer to an array that doesn't contain it", () => {
        const customer: ICustomer = { id: 123 };
        const customerCollection: ICustomer[] = [{ id: 456 }];
        expectedResult = service.addCustomerToCollectionIfMissing(customerCollection, customer);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(customer);
      });

      it('should add only unique Customer to an array', () => {
        const customerArray: ICustomer[] = [{ id: 123 }, { id: 456 }, { id: 20419 }];
        const customerCollection: ICustomer[] = [{ id: 123 }];
        expectedResult = service.addCustomerToCollectionIfMissing(customerCollection, ...customerArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const customer: ICustomer = { id: 123 };
        const customer2: ICustomer = { id: 456 };
        expectedResult = service.addCustomerToCollectionIfMissing([], customer, customer2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(customer);
        expect(expectedResult).toContain(customer2);
      });

      it('should accept null and undefined values', () => {
        const customer: ICustomer = { id: 123 };
        expectedResult = service.addCustomerToCollectionIfMissing([], null, customer, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(customer);
      });

      it('should return initial array if no Customer is added', () => {
        const customerCollection: ICustomer[] = [{ id: 123 }];
        expectedResult = service.addCustomerToCollectionIfMissing(customerCollection, undefined, null);
        expect(expectedResult).toEqual(customerCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
