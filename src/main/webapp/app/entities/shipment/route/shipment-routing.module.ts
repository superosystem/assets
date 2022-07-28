import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ShipmentComponent } from '../list/shipment.component';
import { ShipmentDetailComponent } from '../detail/shipment-detail.component';
import { ShipmentUpdateComponent } from '../update/shipment-update.component';
import { ShipmentRoutingResolveService } from './shipment-routing-resolve.service';

const shipmentRoute: Routes = [
  {
    path: '',
    component: ShipmentComponent,
    data: {
      defaultSort: 'id,asc',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ShipmentDetailComponent,
    resolve: {
      shipment: ShipmentRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ShipmentUpdateComponent,
    resolve: {
      shipment: ShipmentRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ShipmentUpdateComponent,
    resolve: {
      shipment: ShipmentRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(shipmentRoute)],
  exports: [RouterModule],
})
export class ShipmentRoutingModule {}
