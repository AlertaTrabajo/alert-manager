import { computed, inject, Injectable, signal } from '@angular/core';
import { catchError, map, Observable, of, tap, throwError } from 'rxjs';
import { environments } from '../../../environments/environments';
import { AuthStatus, CheckTokenResponse, LoginSuperAdminResponse, User  } from '../interfaces';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly baseUrl: string = environments.baseUrl;
  private http = inject(HttpClient);

  private _redirectUrl: string | null = null;
  private _currentUser = signal<User | null>(null);
  private _authStatus = signal<AuthStatus>(AuthStatus.cheking);

  public currentUser = computed(() => this._currentUser());
  public authStatus = computed(() => this._authStatus());

  constructor() {
    this.checkAuthStatus().subscribe({
      next: (isAuthenticated) => {
        this._authStatus.set(isAuthenticated ? AuthStatus.authenticated : AuthStatus.notAuthenticated);
      },
      error: () => {
        this._authStatus.set(AuthStatus.notAuthenticated);
      }
    });
  }

  isLoggedIn(): boolean {
    return this.authStatus() === AuthStatus.authenticated;
  }

  setRedirectUrl(url: string) {
    this._redirectUrl = url;
  }

  getRedirectUrl(): string {
    const url = this._redirectUrl || '/dashboard';
    return url;
  }

  clearRedirectUrl() {
    this._redirectUrl = null;
  }

  private setAuthentication(user: User, token: string): boolean {
    if (!user || !token) {
      this.logout();
      return false;
    }

    this._currentUser.set(user);
    this._authStatus.set(AuthStatus.authenticated);
    localStorage.setItem('token', token);

    return true;
  }

  loginSuperAdmin(email: string, password: string): Observable<boolean> {
    const url = `${this.baseUrl}/auth/login-superadmin`;
    const body = { email, password };

    return this.http.post<LoginSuperAdminResponse>(url, body).pipe(
      map(response => {
        return this.setAuthentication(response.superAdmin, response.token);
      }),
      catchError(err => {
        console.error('Login error:', err);
        return throwError(() => err.error.message || 'An unknown error occurred');
      })
    );
  }

  checkAuthStatus(): Observable<boolean> {
    const url = `${this.baseUrl}/auth/check-token`;
    const token = localStorage.getItem('token');

    if (!token) {
      return this.logout();
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get<CheckTokenResponse>(url, { headers }).pipe(
      map(({ user, token }) => this.setAuthentication(user, token)),
      catchError(() => {
        return this.logout();
      })
    );
  }

  logout(): Observable<boolean> {
    localStorage.removeItem('token');
    this._currentUser.set(null);
    this._authStatus.set(AuthStatus.notAuthenticated);
    return of(true);
  }

  getCurrentUserId(): string | null {
    return this._currentUser()?._id || null;
  }
}
