import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PasswordchangeComponent } from './passwordchange.component';

describe('PasswordchangeComponent', () => {
  let component: PasswordchangeComponent;
  let fixture: ComponentFixture<PasswordchangeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PasswordchangeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PasswordchangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
