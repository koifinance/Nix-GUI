import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StakingDetailComponent } from './staking-detail.component';

describe('StakingDetailComponent', () => {
  let component: StakingDetailComponent;
  let fixture: ComponentFixture<StakingDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StakingDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StakingDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
