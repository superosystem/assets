import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IProductOrder } from '../product-order.model';
import { ProductOrderService } from '../service/product-order.service';

@Component({
  templateUrl: './product-order-delete-dialog.component.html',
})
export class ProductOrderDeleteDialogComponent {
  productOrder?: IProductOrder;

  constructor(protected productOrderService: ProductOrderService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.productOrderService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
