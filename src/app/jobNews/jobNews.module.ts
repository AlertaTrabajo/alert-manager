import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { JobNewsManagementComponent } from './jobNews-management.component';
import { JobNewsService } from './jobNews.service';
import { MatChipsModule } from '@angular/material/chips';
import { NgbActiveModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterLink } from '@angular/router';
import { EditjobNewComponent } from './edit-jobNew.component';
import { JobNewFormDialogComponent } from './create-jobNew-form-dialog.component';
import { TranslateCategoryPipe } from './pipes/translate-category.pipe';

@NgModule({
  declarations: [
    JobNewsManagementComponent,
    EditjobNewComponent,
    JobNewFormDialogComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatChipsModule,
    NgbModule,
    RouterLink,
    TranslateCategoryPipe
  ],
  providers: [
    JobNewsService,
    NgbActiveModal
  ],
  exports: [
    JobNewsManagementComponent
  ]
})
export class jobNewsModule { }
