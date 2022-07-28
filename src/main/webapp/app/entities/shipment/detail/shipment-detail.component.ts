import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IShipment } from '../shipment.model';

@Component({
  selector: 'jhi-shipment-detail',
  templateUrl: './shipment-detail.component.html',
})
export class ShipmentDetailComponent implements OnInit {
  shipment: IShipment | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ shipment }) => {
      this.shipment = shipment;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
