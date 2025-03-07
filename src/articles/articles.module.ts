import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { MatChipsModule } from '@angular/material/chips';
import { NgbActiveModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { ArticlesService } from './articles.service';
import { CreateArticleFormComponent } from './create-article-form-dialog.component';
import { EditArticleComponent } from './edit-article.component';
import { ArticlesManagementComponent } from './articles-management.component';
import { TranslateArticleCategoryPipe } from './pipes/translate-category.pipe';

@NgModule({
  declarations: [
    CreateArticleFormComponent,
    ArticlesManagementComponent,
    EditArticleComponent,
    TranslateArticleCategoryPipe
  ],
  
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule,
    MatChipsModule,
    NgbModule,
    DatePipe
  ],
  providers: [
    ArticlesService,
    NgbActiveModal
  ],
  exports: [
    CreateArticleFormComponent,
    ArticlesManagementComponent,
    EditArticleComponent
  ]
})
export class ArticlesModule { }
