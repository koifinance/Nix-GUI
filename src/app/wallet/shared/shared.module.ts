import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ClipboardModule } from 'ngx-clipboard';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { DirectiveModule } from './directive/directive.module';
import { MaterialModule } from '../../material/material.module';

import { FilterService } from '../transactions/filter.service';
import { TransactionService } from './transaction/transaction.service';

import { HeaderComponent } from './header/header.component';
import { HelpComponent } from './help/help.component';
import { PaginatorComponent } from './paginator/paginator.component';
import { TransactionTableComponent } from './transaction/transaction-table.component';
import { CustomHeaderComponent } from './custom-header/custom-header.component';

// import { DeleteConfirmationModalComponent } from './delete-confirmation-modal/delete-confirmation-modal.component';

@NgModule({
  imports: [
    CommonModule,
    ClipboardModule,
    DirectiveModule,
    FormsModule,
    HttpClientModule,
    FontAwesomeModule,
    MaterialModule,
  ],
  declarations: [
    // DeleteConfirmationModalComponent
    HeaderComponent,
    HelpComponent,
    PaginatorComponent,
    TransactionTableComponent,
    CustomHeaderComponent,
  ],
  exports: [
    CommonModule,
    ClipboardModule,
    DirectiveModule,
    FormsModule,
    HttpClientModule,
    HeaderComponent,
    FontAwesomeModule,
    MaterialModule,
    HelpComponent,
    PaginatorComponent,
    TransactionTableComponent,
  ],
  entryComponents: [
    // DeleteConfirmationModalComponent
  ],
  providers: [TransactionService, FilterService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SharedModule { }
