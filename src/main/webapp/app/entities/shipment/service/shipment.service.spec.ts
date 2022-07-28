import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import dayjs from 'dayjs/esm';

import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IShipment, Shipment } from '../shipment.model';

import { ShipmentService } from './shipment.service';

describe('Shipment Service', () => {
  let service: ShipmentService;
  let httpMock: HttpTestingController;
  let elemDefault: IShipment;
  let expectedResult: IShipment | IShipment[] | boolean | null;
  let currentDate: dayjs.Dayjs;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(ShipmentService);
    httpMock = TestBed.inject(HttpTestingController);
    currentDate = dayjs();

    elemDefault = {
      id: 0,
      trackingCode: 'AAAAAAA',
      date: currentDate,
      details: 'AAAAAAA',
    };
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = Object.assign(
        {
          date: currentDate.format(DATE_TIME_FORMAT),
        },
        elemDefault
      );

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(elemDefault);
    });

    it('should create a Shipment', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
          date: currentDate.format(DATE_TIME_FORMAT),
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          date: currentDate,
        },
        returnedFromService
      );

      service.create(new Shipment()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Shipment', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          trackingCode: 'BBBBBB',
          date: currentDate.format(DATE_TIME_FORMAT),
          details: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          date: currentDate,
        },
        returnedFromService
      );

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Shipment', () => {
      const patchObject = Object.assign(
        {
          trackingCode: 'BBBBBB',
          date: currentDate.format(DATE_TIME_FORMAT),
          details: 'BBBBBB',
        },
        new Shipment()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign(
        {
          date: currentDate,
        },
        returnedFromService
      );

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Shipment', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          trackingCode: 'BBBBBB',
          date: currentDate.format(DATE_TIME_FORMAT),
          details: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          date: currentDate,
        },
        returnedFromService
      );

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toContainEqual(expected);
    });

    it('should delete a Shipment', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addShipmentToCollectionIfMissing', () => {
      it('should add a Shipment to an empty array', () => {
        const shipment: IShipment = { id: 123 };
        expectedResult = service.addShipmentToCollectionIfMissing([], shipment);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(shipment);
      });

      it('should not add a Shipment to an array that contains it', () => {
        const shipment: IShipment = { id: 123 };
        const shipmentCollection: IShipment[] = [
          {
            ...shipment,
          },
          { id: 456 },
        ];
        expectedResult = service.addShipmentToCollectionIfMissing(shipmentCollection, shipment);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Shipment to an array that doesn't contain it", () => {
        const shipment: IShipment = { id: 123 };
        const shipmentCollection: IShipment[] = [{ id: 456 }];
        expectedResult = service.addShipmentToCollectionIfMissing(shipmentCollection, shipment);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(shipment);
      });

      it('should add only unique Shipment to an array', () => {
        const shipmentArray: IShipment[] = [{ id: 123 }, { id: 456 }, { id: 5678 }];
        const shipmentCollection: IShipment[] = [{ id: 123 }];
        expectedResult = service.addShipmentToCollectionIfMissing(shipmentCollection, ...shipmentArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const shipment: IShipment = { id: 123 };
        const shipment2: IShipment = { id: 456 };
        expectedResult = service.addShipmentToCollectionIfMissing([], shipment, shipment2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(shipment);
        expect(expectedResult).toContain(shipment2);
      });

      it('should accept null and undefined values', () => {
        const shipment: IShipment = { id: 123 };
        expectedResult = service.addShipmentToCollectionIfMissing([], null, shipment, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(shipment);
      });

      it('should return initial array if no Shipment is added', () => {
        const shipmentCollection: IShipment[] = [{ id: 123 }];
        expectedResult = service.addShipmentToCollectionIfMissing(shipmentCollection, undefined, null);
        expect(expectedResult).toEqual(shipmentCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
