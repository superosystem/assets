import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IOrderItem } from '../order-item.model';
import { OrderItemService } from '../service/order-item.service';

@Component({
  templateUrl: './order-item-delete-dialog.component.html',
})
export class OrderItemDeleteDialogComponent {
  orderItem?: IOrderItem;

  constructor(protected orderItemService: OrderItemService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.orderItemService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
