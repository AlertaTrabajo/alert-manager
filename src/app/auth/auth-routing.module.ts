import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { isNotAuthenticatedGuard } from './guards/is-not-authenticated.guard';
import { LoginPageComponent } from './pages/login-page.component';

const routes: Routes = [
  {
    path: 'login',
    component: LoginPageComponent,
    canActivate: [isNotAuthenticatedGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRoutingModule {}
