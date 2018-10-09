import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SyncingWalletComponent } from './syncing-wallet.component';

describe('SyncingWalletComponent', () => {
  let component: SyncingWalletComponent;
  let fixture: ComponentFixture<SyncingWalletComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SyncingWalletComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SyncingWalletComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
