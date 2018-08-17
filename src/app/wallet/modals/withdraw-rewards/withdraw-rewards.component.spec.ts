import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WithdrawRewardsComponent } from './withdraw-rewards.component';

describe('WithdrawRewardsComponent', () => {
  let component: WithdrawRewardsComponent;
  let fixture: ComponentFixture<WithdrawRewardsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WithdrawRewardsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WithdrawRewardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
