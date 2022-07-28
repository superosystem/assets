import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IOrderItem, OrderItem } from '../order-item.model';
import { OrderItemService } from '../service/order-item.service';
import { IProduct } from 'app/entities/product/product.model';
import { ProductService } from 'app/entities/product/service/product.service';
import { IProductOrder } from 'app/entities/product-order/product-order.model';
import { ProductOrderService } from 'app/entities/product-order/service/product-order.service';
import { OrderItemStatus } from 'app/entities/enumerations/order-item-status.model';

@Component({
  selector: 'jhi-order-item-update',
  templateUrl: './order-item-update.component.html',
})
export class OrderItemUpdateComponent implements OnInit {
  isSaving = false;
  orderItemStatusValues = Object.keys(OrderItemStatus);

  productsSharedCollection: IProduct[] = [];
  productOrdersSharedCollection: IProductOrder[] = [];

  editForm = this.fb.group({
    id: [],
    quantity: [null, [Validators.required, Validators.min(0)]],
    totalPrice: [null, [Validators.required, Validators.min(0)]],
    status: [null, [Validators.required]],
    product: [],
    order: [],
  });

  constructor(
    protected orderItemService: OrderItemService,
    protected productService: ProductService,
    protected productOrderService: ProductOrderService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ orderItem }) => {
      this.updateForm(orderItem);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const orderItem = this.createFromForm();
    if (orderItem.id !== undefined) {
      this.subscribeToSaveResponse(this.orderItemService.update(orderItem));
    } else {
      this.subscribeToSaveResponse(this.orderItemService.create(orderItem));
    }
  }

  trackProductById(_index: number, item: IProduct): number {
    return item.id!;
  }

  trackProductOrderById(_index: number, item: IProductOrder): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IOrderItem>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(orderItem: IOrderItem): void {
    this.editForm.patchValue({
      id: orderItem.id,
      quantity: orderItem.quantity,
      totalPrice: orderItem.totalPrice,
      status: orderItem.status,
      product: orderItem.product,
      order: orderItem.order,
    });

    this.productsSharedCollection = this.productService.addProductToCollectionIfMissing(this.productsSharedCollection, orderItem.product);
    this.productOrdersSharedCollection = this.productOrderService.addProductOrderToCollectionIfMissing(
      this.productOrdersSharedCollection,
      orderItem.order
    );
  }

  protected loadRelationshipsOptions(): void {
    this.productService
      .query()
      .pipe(map((res: HttpResponse<IProduct[]>) => res.body ?? []))
      .pipe(
        map((products: IProduct[]) => this.productService.addProductToCollectionIfMissing(products, this.editForm.get('product')!.value))
      )
      .subscribe((products: IProduct[]) => (this.productsSharedCollection = products));

    this.productOrderService
      .query()
      .pipe(map((res: HttpResponse<IProductOrder[]>) => res.body ?? []))
      .pipe(
        map((productOrders: IProductOrder[]) =>
          this.productOrderService.addProductOrderToCollectionIfMissing(productOrders, this.editForm.get('order')!.value)
        )
      )
      .subscribe((productOrders: IProductOrder[]) => (this.productOrdersSharedCollection = productOrders));
  }

  protected createFromForm(): IOrderItem {
    return {
      ...new OrderItem(),
      id: this.editForm.get(['id'])!.value,
      quantity: this.editForm.get(['quantity'])!.value,
      totalPrice: this.editForm.get(['totalPrice'])!.value,
      status: this.editForm.get(['status'])!.value,
      product: this.editForm.get(['product'])!.value,
      order: this.editForm.get(['order'])!.value,
    };
  }
}
