import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { ProductCategoryService } from '../service/product-category.service';
import { IProductCategory, ProductCategory } from '../product-category.model';

import { ProductCategoryUpdateComponent } from './product-category-update.component';

describe('ProductCategory Management Update Component', () => {
  let comp: ProductCategoryUpdateComponent;
  let fixture: ComponentFixture<ProductCategoryUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let productCategoryService: ProductCategoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [ProductCategoryUpdateComponent],
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
      .overrideTemplate(ProductCategoryUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ProductCategoryUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    productCategoryService = TestBed.inject(ProductCategoryService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const productCategory: IProductCategory = { id: 456 };

      activatedRoute.data = of({ productCategory });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(productCategory));
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ProductCategory>>();
      const productCategory = { id: 123 };
      jest.spyOn(productCategoryService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ productCategory });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: productCategory }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(productCategoryService.update).toHaveBeenCalledWith(productCategory);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ProductCategory>>();
      const productCategory = new ProductCategory();
      jest.spyOn(productCategoryService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ productCategory });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: productCategory }));
      saveSubject.complete();

      // THEN
      expect(productCategoryService.create).toHaveBeenCalledWith(productCategory);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ProductCategory>>();
      const productCategory = { id: 123 };
      jest.spyOn(productCategoryService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ productCategory });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(productCategoryService.update).toHaveBeenCalledWith(productCategory);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
