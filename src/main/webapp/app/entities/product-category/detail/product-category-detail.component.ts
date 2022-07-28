import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IProductCategory } from '../product-category.model';

@Component({
  selector: 'jhi-product-category-detail',
  templateUrl: './product-category-detail.component.html',
})
export class ProductCategoryDetailComponent implements OnInit {
  productCategory: IProductCategory | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ productCategory }) => {
      this.productCategory = productCategory;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
