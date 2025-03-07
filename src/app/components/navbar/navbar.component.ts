import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { AuthService } from '../../auth/services/auth.service';
import { MatSidenav } from '@angular/material/sidenav';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-navbar',
  standalone: false,
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements AfterViewInit {
  @ViewChild('sidenav') sidenav!: MatSidenav;
  private routerSubscription!: Subscription;

  constructor(private authService: AuthService, private router: Router) {}

  ngAfterViewInit() {
    // Cerrar la sidenav cuando se navega a una nueva ruta
    this.routerSubscription = this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.closeSidenav();
      }
    });
  }

  ngOnDestroy() {
    // Desuscribirse para evitar pérdidas de memoria
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  closeSidenav() {
    if (this.sidenav) {
      this.sidenav.close();
    }
  }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  login() {
    this.router.navigate(['/login']);
  }

  logout() {
    this.authService.logout().subscribe({
      next: () => {
        this.router.navigate(['/auth/login']);
      },
      error: (err) => {
        console.error('Error al cerrar sesión', err);
        this.router.navigate(['/auth/login']);
      }
    });
  }
}
