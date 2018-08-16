import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RewardHistoryChartComponent } from './reward-history-chart.component';

describe('RewardHistoryChartComponent', () => {
  let component: RewardHistoryChartComponent;
  let fixture: ComponentFixture<RewardHistoryChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RewardHistoryChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RewardHistoryChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
