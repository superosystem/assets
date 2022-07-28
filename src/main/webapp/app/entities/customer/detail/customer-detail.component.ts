import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ICustomer } from '../customer.model';

@Component({
  selector: 'jhi-customer-detail',
  templateUrl: './customer-detail.component.html',
})
export class CustomerDetailComponent implements OnInit {
  customer: ICustomer | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ customer }) => {
      this.customer = customer;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
