import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { OrderItemService } from '../service/order-item.service';
import { IOrderItem, OrderItem } from '../order-item.model';
import { IProduct } from 'app/entities/product/product.model';
import { ProductService } from 'app/entities/product/service/product.service';
import { IProductOrder } from 'app/entities/product-order/product-order.model';
import { ProductOrderService } from 'app/entities/product-order/service/product-order.service';

import { OrderItemUpdateComponent } from './order-item-update.component';

describe('OrderItem Management Update Component', () => {
  let comp: OrderItemUpdateComponent;
  let fixture: ComponentFixture<OrderItemUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let orderItemService: OrderItemService;
  let productService: ProductService;
  let productOrderService: ProductOrderService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [OrderItemUpdateComponent],
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
      .overrideTemplate(OrderItemUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(OrderItemUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    orderItemService = TestBed.inject(OrderItemService);
    productService = TestBed.inject(ProductService);
    productOrderService = TestBed.inject(ProductOrderService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Product query and add missing value', () => {
      const orderItem: IOrderItem = { id: 456 };
      const product: IProduct = { id: 84737 };
      orderItem.product = product;

      const productCollection: IProduct[] = [{ id: 25918 }];
      jest.spyOn(productService, 'query').mockReturnValue(of(new HttpResponse({ body: productCollection })));
      const additionalProducts = [product];
      const expectedCollection: IProduct[] = [...additionalProducts, ...productCollection];
      jest.spyOn(productService, 'addProductToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ orderItem });
      comp.ngOnInit();

      expect(productService.query).toHaveBeenCalled();
      expect(productService.addProductToCollectionIfMissing).toHaveBeenCalledWith(productCollection, ...additionalProducts);
      expect(comp.productsSharedCollection).toEqual(expectedCollection);
    });

    it('Should call ProductOrder query and add missing value', () => {
      const orderItem: IOrderItem = { id: 456 };
      const order: IProductOrder = { id: 71209 };
      orderItem.order = order;

      const productOrderCollection: IProductOrder[] = [{ id: 41394 }];
      jest.spyOn(productOrderService, 'query').mockReturnValue(of(new HttpResponse({ body: productOrderCollection })));
      const additionalProductOrders = [order];
      const expectedCollection: IProductOrder[] = [...additionalProductOrders, ...productOrderCollection];
      jest.spyOn(productOrderService, 'addProductOrderToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ orderItem });
      comp.ngOnInit();

      expect(productOrderService.query).toHaveBeenCalled();
      expect(productOrderService.addProductOrderToCollectionIfMissing).toHaveBeenCalledWith(
        productOrderCollection,
        ...additionalProductOrders
      );
      expect(comp.productOrdersSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const orderItem: IOrderItem = { id: 456 };
      const product: IProduct = { id: 72954 };
      orderItem.product = product;
      const order: IProductOrder = { id: 83200 };
      orderItem.order = order;

      activatedRoute.data = of({ orderItem });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(orderItem));
      expect(comp.productsSharedCollection).toContain(product);
      expect(comp.productOrdersSharedCollection).toContain(order);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<OrderItem>>();
      const orderItem = { id: 123 };
      jest.spyOn(orderItemService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ orderItem });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: orderItem }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(orderItemService.update).toHaveBeenCalledWith(orderItem);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<OrderItem>>();
      const orderItem = new OrderItem();
      jest.spyOn(orderItemService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ orderItem });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: orderItem }));
      saveSubject.complete();

      // THEN
      expect(orderItemService.create).toHaveBeenCalledWith(orderItem);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<OrderItem>>();
      const orderItem = { id: 123 };
      jest.spyOn(orderItemService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ orderItem });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(orderItemService.update).toHaveBeenCalledWith(orderItem);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackProductById', () => {
      it('Should return tracked Product primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackProductById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });

    describe('trackProductOrderById', () => {
      it('Should return tracked ProductOrder primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackProductOrderById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
