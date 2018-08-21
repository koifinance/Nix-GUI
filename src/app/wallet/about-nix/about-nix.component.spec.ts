import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutNixComponent } from './about-nix.component';

describe('AboutNixComponent', () => {
  let component: AboutNixComponent;
  let fixture: ComponentFixture<AboutNixComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AboutNixComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AboutNixComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
