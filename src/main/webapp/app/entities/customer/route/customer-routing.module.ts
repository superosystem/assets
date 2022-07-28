import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { CustomerComponent } from '../list/customer.component';
import { CustomerDetailComponent } from '../detail/customer-detail.component';
import { CustomerUpdateComponent } from '../update/customer-update.component';
import { CustomerRoutingResolveService } from './customer-routing-resolve.service';

const customerRoute: Routes = [
  {
    path: '',
    component: CustomerComponent,
    data: {
      defaultSort: 'id,asc',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: CustomerDetailComponent,
    resolve: {
      customer: CustomerRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: CustomerUpdateComponent,
    resolve: {
      customer: CustomerRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: CustomerUpdateComponent,
    resolve: {
      customer: CustomerRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(customerRoute)],
  exports: [RouterModule],
})
export class CustomerRoutingModule {}
