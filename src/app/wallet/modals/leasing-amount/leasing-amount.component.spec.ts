import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LeasingAmountComponent } from './leasing-amount.component';

describe('LeasingAmountComponent', () => {
  let component: LeasingAmountComponent;
  let fixture: ComponentFixture<LeasingAmountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LeasingAmountComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeasingAmountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
