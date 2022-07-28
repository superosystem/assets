import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { ProductOrderComponent } from './list/product-order.component';
import { ProductOrderDetailComponent } from './detail/product-order-detail.component';
import { ProductOrderUpdateComponent } from './update/product-order-update.component';
import { ProductOrderDeleteDialogComponent } from './delete/product-order-delete-dialog.component';
import { ProductOrderRoutingModule } from './route/product-order-routing.module';

@NgModule({
  imports: [SharedModule, ProductOrderRoutingModule],
  declarations: [ProductOrderComponent, ProductOrderDetailComponent, ProductOrderUpdateComponent, ProductOrderDeleteDialogComponent],
  entryComponents: [ProductOrderDeleteDialogComponent],
})
export class ProductOrderModule {}
