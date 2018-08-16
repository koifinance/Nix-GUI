import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CancelNodeComponent } from './cancel-node.component';

describe('CancelNodeComponent', () => {
  let component: CancelNodeComponent;
  let fixture: ComponentFixture<CancelNodeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CancelNodeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CancelNodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
