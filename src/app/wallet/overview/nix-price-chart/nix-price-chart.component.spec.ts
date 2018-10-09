import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NixPriceChartComponent } from './nix-price-chart.component';

describe('NixPriceChartComponent', () => {
  let component: NixPriceChartComponent;
  let fixture: ComponentFixture<NixPriceChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NixPriceChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NixPriceChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
