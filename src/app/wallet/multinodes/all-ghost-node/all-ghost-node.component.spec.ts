import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AllGhostNodeComponent } from './all-ghost-node.component';

describe('GhostNodeComponent', () => {
  let component: AllGhostNodeComponent;
  let fixture: ComponentFixture<AllGhostNodeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AllGhostNodeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllGhostNodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
