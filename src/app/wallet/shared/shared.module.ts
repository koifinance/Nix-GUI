import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ClipboardModule } from 'ngx-clipboard';
import { MaterialModule } from '../../material/material.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { DirectiveModule } from './directive/directive.module';
import { PaginatorComponent } from './paginator/paginator.component';
// import { HeaderComponent } from './header/header.component';
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
    // HeaderComponent,
    // DeleteConfirmationModalComponent
    PaginatorComponent
  ],
  exports: [
    CommonModule,
    ClipboardModule,
    DirectiveModule,
    FormsModule,
    HttpClientModule,
    // HeaderComponent,
    FontAwesomeModule,
    MaterialModule,
    PaginatorComponent
  ],
  entryComponents: [
    // DeleteConfirmationModalComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SharedModule { }
