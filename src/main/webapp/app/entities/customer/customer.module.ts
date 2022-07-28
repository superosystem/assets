import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { CustomerComponent } from './list/customer.component';
import { CustomerDetailComponent } from './detail/customer-detail.component';
import { CustomerUpdateComponent } from './update/customer-update.component';
import { CustomerDeleteDialogComponent } from './delete/customer-delete-dialog.component';
import { CustomerRoutingModule } from './route/customer-routing.module';

@NgModule({
  imports: [SharedModule, CustomerRoutingModule],
  declarations: [CustomerComponent, CustomerDetailComponent, CustomerUpdateComponent, CustomerDeleteDialogComponent],
  entryComponents: [CustomerDeleteDialogComponent],
})
export class CustomerModule {}
