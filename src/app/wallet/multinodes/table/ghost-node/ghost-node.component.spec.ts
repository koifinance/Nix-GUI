import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GhostNodeComponent } from './ghost-node.component';

describe('GhostNodeComponent', () => {
  let component: GhostNodeComponent;
  let fixture: ComponentFixture<GhostNodeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GhostNodeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GhostNodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
