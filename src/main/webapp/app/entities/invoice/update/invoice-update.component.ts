import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';

import { IInvoice, Invoice } from '../invoice.model';
import { InvoiceService } from '../service/invoice.service';
import { IProductOrder } from 'app/entities/product-order/product-order.model';
import { ProductOrderService } from 'app/entities/product-order/service/product-order.service';
import { InvoiceStatus } from 'app/entities/enumerations/invoice-status.model';
import { PaymentMethod } from 'app/entities/enumerations/payment-method.model';

@Component({
  selector: 'jhi-invoice-update',
  templateUrl: './invoice-update.component.html',
})
export class InvoiceUpdateComponent implements OnInit {
  isSaving = false;
  invoiceStatusValues = Object.keys(InvoiceStatus);
  paymentMethodValues = Object.keys(PaymentMethod);

  productOrdersSharedCollection: IProductOrder[] = [];

  editForm = this.fb.group({
    id: [],
    date: [null, [Validators.required]],
    details: [],
    status: [null, [Validators.required]],
    paymentMethod: [null, [Validators.required]],
    paymentDate: [null, [Validators.required]],
    paymentAmount: [null, [Validators.required]],
    order: [],
  });

  constructor(
    protected invoiceService: InvoiceService,
    protected productOrderService: ProductOrderService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ invoice }) => {
      if (invoice.id === undefined) {
        const today = dayjs().startOf('day');
        invoice.date = today;
        invoice.paymentDate = today;
      }

      this.updateForm(invoice);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const invoice = this.createFromForm();
    if (invoice.id !== undefined) {
      this.subscribeToSaveResponse(this.invoiceService.update(invoice));
    } else {
      this.subscribeToSaveResponse(this.invoiceService.create(invoice));
    }
  }

  trackProductOrderById(_index: number, item: IProductOrder): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IInvoice>>): void {
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

  protected updateForm(invoice: IInvoice): void {
    this.editForm.patchValue({
      id: invoice.id,
      date: invoice.date ? invoice.date.format(DATE_TIME_FORMAT) : null,
      details: invoice.details,
      status: invoice.status,
      paymentMethod: invoice.paymentMethod,
      paymentDate: invoice.paymentDate ? invoice.paymentDate.format(DATE_TIME_FORMAT) : null,
      paymentAmount: invoice.paymentAmount,
      order: invoice.order,
    });

    this.productOrdersSharedCollection = this.productOrderService.addProductOrderToCollectionIfMissing(
      this.productOrdersSharedCollection,
      invoice.order
    );
  }

  protected loadRelationshipsOptions(): void {
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

  protected createFromForm(): IInvoice {
    return {
      ...new Invoice(),
      id: this.editForm.get(['id'])!.value,
      date: this.editForm.get(['date'])!.value ? dayjs(this.editForm.get(['date'])!.value, DATE_TIME_FORMAT) : undefined,
      details: this.editForm.get(['details'])!.value,
      status: this.editForm.get(['status'])!.value,
      paymentMethod: this.editForm.get(['paymentMethod'])!.value,
      paymentDate: this.editForm.get(['paymentDate'])!.value
        ? dayjs(this.editForm.get(['paymentDate'])!.value, DATE_TIME_FORMAT)
        : undefined,
      paymentAmount: this.editForm.get(['paymentAmount'])!.value,
      order: this.editForm.get(['order'])!.value,
    };
  }
}
