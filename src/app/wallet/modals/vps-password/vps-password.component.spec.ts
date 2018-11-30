import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VpsPasswordComponent } from './vps-password.component';

describe('VpsPasswordComponent', () => {
  let component: VpsPasswordComponent;
  let fixture: ComponentFixture<VpsPasswordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VpsPasswordComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VpsPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
