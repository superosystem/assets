import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ShipmentDetailComponent } from './shipment-detail.component';

describe('Shipment Management Detail Component', () => {
  let comp: ShipmentDetailComponent;
  let fixture: ComponentFixture<ShipmentDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ShipmentDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ shipment: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(ShipmentDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(ShipmentDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load shipment on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.shipment).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
