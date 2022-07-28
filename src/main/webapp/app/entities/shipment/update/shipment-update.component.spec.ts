import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { ShipmentService } from '../service/shipment.service';
import { IShipment, Shipment } from '../shipment.model';
import { IInvoice } from 'app/entities/invoice/invoice.model';
import { InvoiceService } from 'app/entities/invoice/service/invoice.service';

import { ShipmentUpdateComponent } from './shipment-update.component';

describe('Shipment Management Update Component', () => {
  let comp: ShipmentUpdateComponent;
  let fixture: ComponentFixture<ShipmentUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let shipmentService: ShipmentService;
  let invoiceService: InvoiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [ShipmentUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(ShipmentUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ShipmentUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    shipmentService = TestBed.inject(ShipmentService);
    invoiceService = TestBed.inject(InvoiceService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Invoice query and add missing value', () => {
      const shipment: IShipment = { id: 456 };
      const invoice: IInvoice = { id: 96059 };
      shipment.invoice = invoice;

      const invoiceCollection: IInvoice[] = [{ id: 99198 }];
      jest.spyOn(invoiceService, 'query').mockReturnValue(of(new HttpResponse({ body: invoiceCollection })));
      const additionalInvoices = [invoice];
      const expectedCollection: IInvoice[] = [...additionalInvoices, ...invoiceCollection];
      jest.spyOn(invoiceService, 'addInvoiceToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ shipment });
      comp.ngOnInit();

      expect(invoiceService.query).toHaveBeenCalled();
      expect(invoiceService.addInvoiceToCollectionIfMissing).toHaveBeenCalledWith(invoiceCollection, ...additionalInvoices);
      expect(comp.invoicesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const shipment: IShipment = { id: 456 };
      const invoice: IInvoice = { id: 56549 };
      shipment.invoice = invoice;

      activatedRoute.data = of({ shipment });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(shipment));
      expect(comp.invoicesSharedCollection).toContain(invoice);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Shipment>>();
      const shipment = { id: 123 };
      jest.spyOn(shipmentService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ shipment });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: shipment }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(shipmentService.update).toHaveBeenCalledWith(shipment);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Shipment>>();
      const shipment = new Shipment();
      jest.spyOn(shipmentService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ shipment });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: shipment }));
      saveSubject.complete();

      // THEN
      expect(shipmentService.create).toHaveBeenCalledWith(shipment);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Shipment>>();
      const shipment = { id: 123 };
      jest.spyOn(shipmentService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ shipment });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(shipmentService.update).toHaveBeenCalledWith(shipment);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackInvoiceById', () => {
      it('Should return tracked Invoice primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackInvoiceById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
