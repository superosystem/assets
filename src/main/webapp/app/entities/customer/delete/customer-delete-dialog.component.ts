import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ICustomer } from '../customer.model';
import { CustomerService } from '../service/customer.service';

@Component({
  templateUrl: './customer-delete-dialog.component.html',
})
export class CustomerDeleteDialogComponent {
  customer?: ICustomer;

  constructor(protected customerService: CustomerService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.customerService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
