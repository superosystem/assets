import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IProductCategory } from '../product-category.model';
import { ProductCategoryService } from '../service/product-category.service';
import { ProductCategoryDeleteDialogComponent } from '../delete/product-category-delete-dialog.component';

@Component({
  selector: 'jhi-product-category',
  templateUrl: './product-category.component.html',
})
export class ProductCategoryComponent implements OnInit {
  productCategories?: IProductCategory[];
  isLoading = false;

  constructor(protected productCategoryService: ProductCategoryService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.productCategoryService.query().subscribe({
      next: (res: HttpResponse<IProductCategory[]>) => {
        this.isLoading = false;
        this.productCategories = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(_index: number, item: IProductCategory): number {
    return item.id!;
  }

  delete(productCategory: IProductCategory): void {
    const modalRef = this.modalService.open(ProductCategoryDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.productCategory = productCategory;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
