import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';

import { IShipment, Shipment } from '../shipment.model';
import { ShipmentService } from '../service/shipment.service';
import { IInvoice } from 'app/entities/invoice/invoice.model';
import { InvoiceService } from 'app/entities/invoice/service/invoice.service';

@Component({
  selector: 'jhi-shipment-update',
  templateUrl: './shipment-update.component.html',
})
export class ShipmentUpdateComponent implements OnInit {
  isSaving = false;

  invoicesSharedCollection: IInvoice[] = [];

  editForm = this.fb.group({
    id: [],
    trackingCode: [],
    date: [null, [Validators.required]],
    details: [],
    invoice: [],
  });

  constructor(
    protected shipmentService: ShipmentService,
    protected invoiceService: InvoiceService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ shipment }) => {
      if (shipment.id === undefined) {
        const today = dayjs().startOf('day');
        shipment.date = today;
      }

      this.updateForm(shipment);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const shipment = this.createFromForm();
    if (shipment.id !== undefined) {
      this.subscribeToSaveResponse(this.shipmentService.update(shipment));
    } else {
      this.subscribeToSaveResponse(this.shipmentService.create(shipment));
    }
  }

  trackInvoiceById(_index: number, item: IInvoice): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IShipment>>): void {
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

  protected updateForm(shipment: IShipment): void {
    this.editForm.patchValue({
      id: shipment.id,
      trackingCode: shipment.trackingCode,
      date: shipment.date ? shipment.date.format(DATE_TIME_FORMAT) : null,
      details: shipment.details,
      invoice: shipment.invoice,
    });

    this.invoicesSharedCollection = this.invoiceService.addInvoiceToCollectionIfMissing(this.invoicesSharedCollection, shipment.invoice);
  }

  protected loadRelationshipsOptions(): void {
    this.invoiceService
      .query()
      .pipe(map((res: HttpResponse<IInvoice[]>) => res.body ?? []))
      .pipe(
        map((invoices: IInvoice[]) => this.invoiceService.addInvoiceToCollectionIfMissing(invoices, this.editForm.get('invoice')!.value))
      )
      .subscribe((invoices: IInvoice[]) => (this.invoicesSharedCollection = invoices));
  }

  protected createFromForm(): IShipment {
    return {
      ...new Shipment(),
      id: this.editForm.get(['id'])!.value,
      trackingCode: this.editForm.get(['trackingCode'])!.value,
      date: this.editForm.get(['date'])!.value ? dayjs(this.editForm.get(['date'])!.value, DATE_TIME_FORMAT) : undefined,
      details: this.editForm.get(['details'])!.value,
      invoice: this.editForm.get(['invoice'])!.value,
    };
  }
}
