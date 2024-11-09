import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authTokenKey = 'authToken';
  private userRoleKey = 'userRole';
  private userIdKey = 'userId';
  private userDataKey = 'userData';

  constructor() { }

  login(token: string, role: string, userId: number, userData: any): void {
    localStorage.setItem(this.authTokenKey, token);
    localStorage.setItem(this.userRoleKey, role);
    localStorage.setItem(this.userIdKey, userId.toString());
    localStorage.setItem(this.userDataKey, JSON.stringify(userData));
  }

  logout(): void {
    localStorage.removeItem(this.authTokenKey);
    localStorage.removeItem(this.userRoleKey);
    localStorage.removeItem(this.userIdKey);
    localStorage.removeItem(this.userDataKey);
  }

  getToken(): string | null {
    return localStorage.getItem(this.authTokenKey);
  }

  getRole(): string | null {
    return localStorage.getItem(this.userRoleKey);
  }

  getUserId(): number | null {
    const userId = localStorage.getItem(this.userIdKey);
    return userId ? parseInt(userId, 10) : null;
  }

  getUserData(): any {
    const userData = localStorage.getItem(this.userDataKey);
    return userData ? JSON.parse(userData) : null;
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  hasRole(expectedRole: string): boolean {
    const role = this.getRole();
    return role === expectedRole;
  }
}