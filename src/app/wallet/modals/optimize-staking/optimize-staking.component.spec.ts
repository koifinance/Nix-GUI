import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OptimizeStakingComponent } from './optimize-staking.component';

describe('OptimizeStakingComponent', () => {
  let component: OptimizeStakingComponent;
  let fixture: ComponentFixture<OptimizeStakingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OptimizeStakingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OptimizeStakingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
