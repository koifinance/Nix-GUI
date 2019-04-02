import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LeasingContractComponent } from './leasing-contract.component';

describe('LeasingContractComponent', () => {
  let component: LeasingContractComponent;
  let fixture: ComponentFixture<LeasingContractComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LeasingContractComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeasingContractComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
