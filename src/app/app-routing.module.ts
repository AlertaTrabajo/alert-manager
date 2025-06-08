import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { isAuthenticatedGuard } from './auth/guards/is-authenticated.guard';
import { isNotAuthenticatedGuard } from './auth/guards/is-not-authenticated.guard';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ImagesComponent } from './images/images.component';
import { JobNewsManagementComponent } from './jobNews/jobNews-management.component';
import { JobNewFormDialogComponent } from './jobNews/create-jobNew-form-dialog.component';
import { EditjobNewComponent } from './jobNews/edit-jobNew.component';
import { VideosComponent } from './videos/videos.component';
import { ArticlesManagementComponent } from '../articles/articles-management.component';
import { CreateArticleFormComponent } from '../articles/create-article-form-dialog.component';
import { EditArticleComponent } from '../articles/edit-article.component';
import { VacationRequestComponent } from './reports/vacation-request/vacation-request.component';

const routes: Routes = [
  {
    path: 'auth',
    canActivate: [isNotAuthenticatedGuard],
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule),
  },
  {
    path: '',
    canActivate: [isAuthenticatedGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      // Rutas para noticias
      { path: 'news', component: JobNewsManagementComponent },
      { path: 'news/create', component: JobNewFormDialogComponent },
      { path: 'news/edit/:id', component: EditjobNewComponent },
      // Rutas para artículos
      { path: 'articles', component: ArticlesManagementComponent },
      { path: 'articles/create', component: CreateArticleFormComponent },
      { path: 'articles/edit/:id', component: EditArticleComponent },
      // Otras rutas
      { path: 'images', component: ImagesComponent },
      { path: 'videos', component: VideosComponent },
      { path: 'reports', component: VacationRequestComponent },

    ],
  },
  { path: '**', redirectTo: 'dashboard' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
