import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
import { API_BASE_URL } from './api.config';
import { AuthResponse } from '../models/pharmacy.models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  currentUser = signal<AuthResponse | null>(this.loadUser());

  constructor(private http: HttpClient, private router: Router) {}

  register(payload: { userName: string; userEmail: string; password: string; role: string }) {
    return this.http.post<AuthResponse>(`${API_BASE_URL}/auth/register`, payload).pipe(tap((user) => this.setSession(user)));
  }

  login(payload: { userEmail: string; password: string }) {
    return this.http.post<AuthResponse>(`${API_BASE_URL}/auth/login`, payload).pipe(tap((user) => this.setSession(user)));
  }

  logout() {
    localStorage.removeItem('pharmacyUser');
    this.currentUser.set(null);
    this.router.navigateByUrl('/login');
  }

  isAdmin() {
    return this.currentUser()?.role === 'Admin';
  }

  private setSession(user: AuthResponse) {
    localStorage.setItem('pharmacyUser', JSON.stringify(user));
    this.currentUser.set(user);
  }

  private loadUser(): AuthResponse | null {
    const raw = localStorage.getItem('pharmacyUser');
    return raw ? JSON.parse(raw) : null;
  }
}
