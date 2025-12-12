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

  // obtener el token CSRF inicial (si lo usas desde backend)
  getCsrfToken(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/csrf-token`, { withCredentials: true });
  }

  // ahora esperamos username en lugar de email
  login(credentials: { username: string; password: string }): Observable<User> {
    return this.http.post<AuthResponse>(`${this.API_URL}/login`, credentials, { withCredentials: true })
      .pipe(
        map(res => res.user), // extraer solo el user del body
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
    return this.http.post<AuthResponse>(`${this.API_URL}/refresh-token`, {}, { withCredentials: true })
      .pipe(
        map(res => res.user),
        tap((user) => this._currentUser.set(user)),
        catchError(err => {
          this._currentUser.set(null);
          return throwError(() => err);
        })
      );
  }

  checkStatus(): Promise<boolean> {
    return new Promise((resolve) => {
      this.http.get<AuthResponse>(`${this.API_URL}/check-status`, { withCredentials: true })
        .subscribe({
          next: (res) => {
            // puede que backend devuelva success+user
            const user = (res as any).user ?? (res as any);
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
    if (!user || !user.roles) return false;
    return user.roles.includes(expectedRole);
  }
}
