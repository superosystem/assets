import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { InvoiceService } from '../service/invoice.service';
import { IInvoice, Invoice } from '../invoice.model';
import { IProductOrder } from 'app/entities/product-order/product-order.model';
import { ProductOrderService } from 'app/entities/product-order/service/product-order.service';

import { InvoiceUpdateComponent } from './invoice-update.component';

describe('Invoice Management Update Component', () => {
  let comp: InvoiceUpdateComponent;
  let fixture: ComponentFixture<InvoiceUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let invoiceService: InvoiceService;
  let productOrderService: ProductOrderService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [InvoiceUpdateComponent],
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
      .overrideTemplate(InvoiceUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(InvoiceUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    invoiceService = TestBed.inject(InvoiceService);
    productOrderService = TestBed.inject(ProductOrderService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call ProductOrder query and add missing value', () => {
      const invoice: IInvoice = { id: 456 };
      const order: IProductOrder = { id: 24751 };
      invoice.order = order;

      const productOrderCollection: IProductOrder[] = [{ id: 90526 }];
      jest.spyOn(productOrderService, 'query').mockReturnValue(of(new HttpResponse({ body: productOrderCollection })));
      const additionalProductOrders = [order];
      const expectedCollection: IProductOrder[] = [...additionalProductOrders, ...productOrderCollection];
      jest.spyOn(productOrderService, 'addProductOrderToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ invoice });
      comp.ngOnInit();

      expect(productOrderService.query).toHaveBeenCalled();
      expect(productOrderService.addProductOrderToCollectionIfMissing).toHaveBeenCalledWith(
        productOrderCollection,
        ...additionalProductOrders
      );
      expect(comp.productOrdersSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const invoice: IInvoice = { id: 456 };
      const order: IProductOrder = { id: 68322 };
      invoice.order = order;

      activatedRoute.data = of({ invoice });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(invoice));
      expect(comp.productOrdersSharedCollection).toContain(order);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Invoice>>();
      const invoice = { id: 123 };
      jest.spyOn(invoiceService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ invoice });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: invoice }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(invoiceService.update).toHaveBeenCalledWith(invoice);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Invoice>>();
      const invoice = new Invoice();
      jest.spyOn(invoiceService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ invoice });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: invoice }));
      saveSubject.complete();

      // THEN
      expect(invoiceService.create).toHaveBeenCalledWith(invoice);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Invoice>>();
      const invoice = { id: 123 };
      jest.spyOn(invoiceService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ invoice });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(invoiceService.update).toHaveBeenCalledWith(invoice);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackProductOrderById', () => {
      it('Should return tracked ProductOrder primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackProductOrderById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
