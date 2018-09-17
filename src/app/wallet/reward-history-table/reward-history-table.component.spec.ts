import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RewardHistoryTableComponent } from './reward-history-table.component';

describe('RewardHistoryTableComponent', () => {
  let component: RewardHistoryTableComponent;
  let fixture: ComponentFixture<RewardHistoryTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RewardHistoryTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RewardHistoryTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
