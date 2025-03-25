import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private user: any = null; 

  constructor() { }

  
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
