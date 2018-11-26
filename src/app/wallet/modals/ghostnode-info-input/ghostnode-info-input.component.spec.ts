import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GhostnodeInfoInputComponent } from './ghostnode-info-input.component';

describe('GhostnodeInfoInputComponent', () => {
  let component: GhostnodeInfoInputComponent;
  let fixture: ComponentFixture<GhostnodeInfoInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GhostnodeInfoInputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GhostnodeInfoInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
