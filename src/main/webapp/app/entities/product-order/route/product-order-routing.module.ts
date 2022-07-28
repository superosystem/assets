import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ProductOrderComponent } from '../list/product-order.component';
import { ProductOrderDetailComponent } from '../detail/product-order-detail.component';
import { ProductOrderUpdateComponent } from '../update/product-order-update.component';
import { ProductOrderRoutingResolveService } from './product-order-routing-resolve.service';

const productOrderRoute: Routes = [
  {
    path: '',
    component: ProductOrderComponent,
    data: {
      defaultSort: 'id,asc',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ProductOrderDetailComponent,
    resolve: {
      productOrder: ProductOrderRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ProductOrderUpdateComponent,
    resolve: {
      productOrder: ProductOrderRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ProductOrderUpdateComponent,
    resolve: {
      productOrder: ProductOrderRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(productOrderRoute)],
  exports: [RouterModule],
})
export class ProductOrderRoutingModule {}
