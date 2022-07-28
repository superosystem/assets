import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { OrderItemComponent } from '../list/order-item.component';
import { OrderItemDetailComponent } from '../detail/order-item-detail.component';
import { OrderItemUpdateComponent } from '../update/order-item-update.component';
import { OrderItemRoutingResolveService } from './order-item-routing-resolve.service';

const orderItemRoute: Routes = [
  {
    path: '',
    component: OrderItemComponent,
    data: {
      defaultSort: 'id,asc',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: OrderItemDetailComponent,
    resolve: {
      orderItem: OrderItemRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: OrderItemUpdateComponent,
    resolve: {
      orderItem: OrderItemRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: OrderItemUpdateComponent,
    resolve: {
      orderItem: OrderItemRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(orderItemRoute)],
  exports: [RouterModule],
})
export class OrderItemRoutingModule {}
