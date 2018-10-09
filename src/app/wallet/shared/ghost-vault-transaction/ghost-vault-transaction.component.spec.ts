import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GhostVaultTransactionComponent } from './ghost-vault-transaction.component';

describe('GhostVaultTransactionComponent', () => {
  let component: GhostVaultTransactionComponent;
  let fixture: ComponentFixture<GhostVaultTransactionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GhostVaultTransactionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GhostVaultTransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
