import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { ProductCategoryService } from '../service/product-category.service';

import { ProductCategoryComponent } from './product-category.component';

describe('ProductCategory Management Component', () => {
  let comp: ProductCategoryComponent;
  let fixture: ComponentFixture<ProductCategoryComponent>;
  let service: ProductCategoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [ProductCategoryComponent],
    })
      .overrideTemplate(ProductCategoryComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ProductCategoryComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(ProductCategoryService);

    const headers = new HttpHeaders();
    jest.spyOn(service, 'query').mockReturnValue(
      of(
        new HttpResponse({
          body: [{ id: 123 }],
          headers,
        })
      )
    );
  });

  it('Should call load all on init', () => {
    // WHEN
    comp.ngOnInit();

    // THEN
    expect(service.query).toHaveBeenCalled();
    expect(comp.productCategories?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
