import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MultinodesComponent } from './multinodes.component';

describe('MultinodesComponent', () => {
  let component: MultinodesComponent;
  let fixture: ComponentFixture<MultinodesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MultinodesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MultinodesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
