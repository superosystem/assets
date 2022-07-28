import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ProductCategoryComponent } from '../list/product-category.component';
import { ProductCategoryDetailComponent } from '../detail/product-category-detail.component';
import { ProductCategoryUpdateComponent } from '../update/product-category-update.component';
import { ProductCategoryRoutingResolveService } from './product-category-routing-resolve.service';

const productCategoryRoute: Routes = [
  {
    path: '',
    component: ProductCategoryComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ProductCategoryDetailComponent,
    resolve: {
      productCategory: ProductCategoryRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ProductCategoryUpdateComponent,
    resolve: {
      productCategory: ProductCategoryRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ProductCategoryUpdateComponent,
    resolve: {
      productCategory: ProductCategoryRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(productCategoryRoute)],
  exports: [RouterModule],
})
export class ProductCategoryRoutingModule {}
