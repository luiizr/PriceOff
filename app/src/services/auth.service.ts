import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../environments/environment';

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthResponse {
  access_token: string;
  user: User;
}

/**
 * SERVICE - Gerencia autenticação do usuário
 */
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {
    this.loadUserFromStorage();
  }

  /**
   * Verifica se usuário está logado
   */
  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  /**
   * Faz login
   */
  login(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/login`, { email, password })
      .pipe(
        tap(response => {
          this.saveAuth(response);
          this.router.navigate(['/dashboard']);
        })
      );
  }

  /**
   * Faz registro
   */
  register(name: string, email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/register`, { name, email, password })
      .pipe(
        tap(response => {
          this.saveAuth(response);
          this.router.navigate(['/dashboard']);
        })
      );
  }

  /**
   * Faz logout
   */
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.currentUserSubject.next(null);
    this.router.navigate(['/']);
  }

  /**
   * Pega token
   */
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  /**
   * Pega usuário atual
   */
  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  /**
   * Salva dados de autenticação
   */
  private saveAuth(response: AuthResponse): void {
    localStorage.setItem('token', response.access_token);
    localStorage.setItem('user', JSON.stringify(response.user));
    this.currentUserSubject.next(response.user);
  }

  /**
   * Carrega usuário do storage
   */
  private loadUserFromStorage(): void {
    const userJson = localStorage.getItem('user');
    if (userJson) {
      try {
        const user = JSON.parse(userJson);
        this.currentUserSubject.next(user);
      } catch (e) {
        console.error('Erro ao carregar usuário do storage', e);
      }
    }
  }
}
