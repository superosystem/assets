import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IProductCategory } from '../product-category.model';
import { ProductCategoryService } from '../service/product-category.service';

@Component({
  templateUrl: './product-category-delete-dialog.component.html',
})
export class ProductCategoryDeleteDialogComponent {
  productCategory?: IProductCategory;

  constructor(protected productCategoryService: ProductCategoryService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.productCategoryService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
