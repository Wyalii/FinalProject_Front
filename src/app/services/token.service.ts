import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  constructor(private cookieService: CookieService) {}

  setAccessToken(token: string): void {
    console.log('Setting token in cookie:', token);
    this.cookieService.set('access_token', token, {
      expires: 1,
      path: '/',
    });
  }
  setRefreshToken(token: string) {
    console.log('Setting token in cookie:', token);
    this.cookieService.set('refresh_token', token, {
      expires: 1,
      path: '/',
    });
  }

  getToken(): string | null {
    return this.cookieService.get('access_token');
  }

  removeToken(): void {
    this.cookieService.delete('access_token', '/');
  }
}
