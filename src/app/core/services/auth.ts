import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, catchError, map, of, tap, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { User, AuthResponse } from '../models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private readonly API_URL = `${environment.apiUrl}/auth`;
  private _currentUser = signal<User | null>(null);
  public currentUser = this._currentUser.asReadonly();
  public isAuthenticated = computed(() => !!this._currentUser());

  constructor() {}

  //obtener el token CSRF inicial
  getCsrfToken(): Observable<any> {
    return this.http.get('http://localhost:4000/csrf-token', { withCredentials: true });
  }

  login(credentials: { email: string; password: string }): Observable<User> {
    return this.http.post<User>(`${this.API_URL}/login`, credentials, { withCredentials: true })
      .pipe(
        tap((user) => this._currentUser.set(user)),
        catchError(err => throwError(() => err))
      );
  }

  logout(): Observable<boolean> {
    return this.http.post(`${this.API_URL}/logout`, {}, { withCredentials: true }).pipe(
      map(() => true),
      catchError(() => of(true)),
      tap(() => {
        this._currentUser.set(null);
        this.router.navigate(['/auth/login']);
      })
    );
  }

  refreshToken(): Observable<User> {
    return this.http.post<User>(`${this.API_URL}/refresh-token`, {}, { withCredentials: true })
      .pipe(
        tap((user) => this._currentUser.set(user)),
        catchError(err => {
          this._currentUser.set(null);
          return throwError(() => err);
        })
      );
  }

checkStatus(): Promise<boolean> {
  
  return new Promise((resolve) => {
    this.http.get<User>(`${this.API_URL}/check-status`, { withCredentials: true })
      .subscribe({
        next: (user) => {
          this._currentUser.set(user);
          resolve(true);
        },
        error: () => {
          this._currentUser.set(null);
          resolve(false);
        }
      });
  });
}

  // Verifica si el usuario tiene un rol específico (ej: 'administrador')
  hasRole(expectedRole: string): boolean {
    const user = this._currentUser();
    if (!user || !user.Roles) return false;
    return user.Roles.some(r => r.name === expectedRole);
  }
}
