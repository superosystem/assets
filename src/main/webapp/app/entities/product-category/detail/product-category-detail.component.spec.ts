import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ProductCategoryDetailComponent } from './product-category-detail.component';

describe('ProductCategory Management Detail Component', () => {
  let comp: ProductCategoryDetailComponent;
  let fixture: ComponentFixture<ProductCategoryDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProductCategoryDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ productCategory: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(ProductCategoryDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(ProductCategoryDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load productCategory on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.productCategory).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
