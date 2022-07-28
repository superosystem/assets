import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { ShipmentComponent } from './list/shipment.component';
import { ShipmentDetailComponent } from './detail/shipment-detail.component';
import { ShipmentUpdateComponent } from './update/shipment-update.component';
import { ShipmentDeleteDialogComponent } from './delete/shipment-delete-dialog.component';
import { ShipmentRoutingModule } from './route/shipment-routing.module';

@NgModule({
  imports: [SharedModule, ShipmentRoutingModule],
  declarations: [ShipmentComponent, ShipmentDetailComponent, ShipmentUpdateComponent, ShipmentDeleteDialogComponent],
  entryComponents: [ShipmentDeleteDialogComponent],
})
export class ShipmentModule {}
