import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'product',
        data: { pageTitle: 'eCommerceApp.product.home.title' },
        loadChildren: () => import('./product/product.module').then(m => m.ProductModule),
      },
      {
        path: 'product-category',
        data: { pageTitle: 'eCommerceApp.productCategory.home.title' },
        loadChildren: () => import('./product-category/product-category.module').then(m => m.ProductCategoryModule),
      },
      {
        path: 'customer',
        data: { pageTitle: 'eCommerceApp.customer.home.title' },
        loadChildren: () => import('./customer/customer.module').then(m => m.CustomerModule),
      },
      {
        path: 'product-order',
        data: { pageTitle: 'eCommerceApp.productOrder.home.title' },
        loadChildren: () => import('./product-order/product-order.module').then(m => m.ProductOrderModule),
      },
      {
        path: 'order-item',
        data: { pageTitle: 'eCommerceApp.orderItem.home.title' },
        loadChildren: () => import('./order-item/order-item.module').then(m => m.OrderItemModule),
      },
      {
        path: 'invoice',
        data: { pageTitle: 'eCommerceApp.invoice.home.title' },
        loadChildren: () => import('./invoice/invoice.module').then(m => m.InvoiceModule),
      },
      {
        path: 'shipment',
        data: { pageTitle: 'eCommerceApp.shipment.home.title' },
        loadChildren: () => import('./shipment/shipment.module').then(m => m.ShipmentModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
