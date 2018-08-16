import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GhostNode1Component } from './ghost-node1.component';

describe('GhostNode1Component', () => {
  let component: GhostNode1Component;
  let fixture: ComponentFixture<GhostNode1Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GhostNode1Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GhostNode1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
