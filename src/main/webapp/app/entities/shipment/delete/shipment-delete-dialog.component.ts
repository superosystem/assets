import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IShipment } from '../shipment.model';
import { ShipmentService } from '../service/shipment.service';

@Component({
  templateUrl: './shipment-delete-dialog.component.html',
})
export class ShipmentDeleteDialogComponent {
  shipment?: IShipment;

  constructor(protected shipmentService: ShipmentService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.shipmentService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
