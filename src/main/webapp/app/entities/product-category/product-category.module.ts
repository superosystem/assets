import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { ProductCategoryComponent } from './list/product-category.component';
import { ProductCategoryDetailComponent } from './detail/product-category-detail.component';
import { ProductCategoryUpdateComponent } from './update/product-category-update.component';
import { ProductCategoryDeleteDialogComponent } from './delete/product-category-delete-dialog.component';
import { ProductCategoryRoutingModule } from './route/product-category-routing.module';

@NgModule({
  imports: [SharedModule, ProductCategoryRoutingModule],
  declarations: [
    ProductCategoryComponent,
    ProductCategoryDetailComponent,
    ProductCategoryUpdateComponent,
    ProductCategoryDeleteDialogComponent,
  ],
  entryComponents: [ProductCategoryDeleteDialogComponent],
})
export class ProductCategoryModule {}
