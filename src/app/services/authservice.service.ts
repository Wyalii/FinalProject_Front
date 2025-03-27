import { Injectable } from '@angular/core';
import { CookieService } from './cookie.service';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private user: any = null; 

  private accessTokenKey = 'access_token';
  private refreshTokenKey = 'refresh_token';

  constructor(private cookieService: CookieService) {}


  getAccessToken(): string | null {
    return this.cookieService.getCookie(this.accessTokenKey); // Retrieve the access token from cookies
  }

  // Get refresh token from cookies
  getRefreshToken(): string | null {
    return this.cookieService.getCookie(this.refreshTokenKey); // Retrieve the refresh token from cookies
  }
  getUser() {
  
    const userFromLocalStorage = localStorage.getItem('user');
    if (userFromLocalStorage) {
      this.user = JSON.parse(userFromLocalStorage);
    }
    return this.user;
  }


  setUser(user: any): void {
    this.user = user;
    localStorage.setItem('user', JSON.stringify(user)); 
  }

 
  logout(): void {
    this.user = null;
    localStorage.removeItem('user'); 
  }

  
  isLoggedIn(): boolean {
    return this.user !== null;
  }
}
