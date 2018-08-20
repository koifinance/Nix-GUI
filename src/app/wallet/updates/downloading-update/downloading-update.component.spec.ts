import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DownloadingUpdateComponent } from './downloading-update.component';

describe('DownloadingUpdateComponent', () => {
  let component: DownloadingUpdateComponent;
  let fixture: ComponentFixture<DownloadingUpdateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DownloadingUpdateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DownloadingUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
