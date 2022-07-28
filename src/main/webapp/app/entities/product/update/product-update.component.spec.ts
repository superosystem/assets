import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { ProductService } from '../service/product.service';
import { IProduct, Product } from '../product.model';
import { IProductCategory } from 'app/entities/product-category/product-category.model';
import { ProductCategoryService } from 'app/entities/product-category/service/product-category.service';

import { ProductUpdateComponent } from './product-update.component';

describe('Product Management Update Component', () => {
  let comp: ProductUpdateComponent;
  let fixture: ComponentFixture<ProductUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let productService: ProductService;
  let productCategoryService: ProductCategoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [ProductUpdateComponent],
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
      .overrideTemplate(ProductUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ProductUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    productService = TestBed.inject(ProductService);
    productCategoryService = TestBed.inject(ProductCategoryService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call ProductCategory query and add missing value', () => {
      const product: IProduct = { id: 456 };
      const productCategory: IProductCategory = { id: 36172 };
      product.productCategory = productCategory;

      const productCategoryCollection: IProductCategory[] = [{ id: 28434 }];
      jest.spyOn(productCategoryService, 'query').mockReturnValue(of(new HttpResponse({ body: productCategoryCollection })));
      const additionalProductCategories = [productCategory];
      const expectedCollection: IProductCategory[] = [...additionalProductCategories, ...productCategoryCollection];
      jest.spyOn(productCategoryService, 'addProductCategoryToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ product });
      comp.ngOnInit();

      expect(productCategoryService.query).toHaveBeenCalled();
      expect(productCategoryService.addProductCategoryToCollectionIfMissing).toHaveBeenCalledWith(
        productCategoryCollection,
        ...additionalProductCategories
      );
      expect(comp.productCategoriesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const product: IProduct = { id: 456 };
      const productCategory: IProductCategory = { id: 58801 };
      product.productCategory = productCategory;

      activatedRoute.data = of({ product });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(product));
      expect(comp.productCategoriesSharedCollection).toContain(productCategory);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Product>>();
      const product = { id: 123 };
      jest.spyOn(productService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ product });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: product }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(productService.update).toHaveBeenCalledWith(product);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Product>>();
      const product = new Product();
      jest.spyOn(productService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ product });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: product }));
      saveSubject.complete();

      // THEN
      expect(productService.create).toHaveBeenCalledWith(product);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Product>>();
      const product = { id: 123 };
      jest.spyOn(productService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ product });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(productService.update).toHaveBeenCalledWith(product);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackProductCategoryById', () => {
      it('Should return tracked ProductCategory primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackProductCategoryById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
