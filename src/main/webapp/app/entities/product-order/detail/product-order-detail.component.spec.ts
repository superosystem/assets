import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ProductOrderDetailComponent } from './product-order-detail.component';

describe('ProductOrder Management Detail Component', () => {
  let comp: ProductOrderDetailComponent;
  let fixture: ComponentFixture<ProductOrderDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProductOrderDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ productOrder: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(ProductOrderDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(ProductOrderDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load productOrder on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.productOrder).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
