import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SignupData } from './signup-data.model';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { stringify } from 'querystring';
import { LoginData } from './login-data.model';

@Injectable({providedIn: 'root'})
export class AuthService{
  private isAuthenticated = false;
  private token: string;
  private userId: string;
  private tokenTimer : any;
  private authStatusListener = new Subject<boolean>();

  constructor(private http: HttpClient, private router: Router) {}

  // getToken() {
  //   return this.token;
  // }

  getIsAuth() {
    return this.isAuthenticated;
  }

  getAuthStatusListener(){
    return this.authStatusListener.asObservable();
  }

  getUserId() {
    return this.userId;
  }

  createUser(email:string, username: string, password: string){
    const authData:SignupData = { email: email, username: username, password: password};
    return this.http.post("http://localhost:3000/api/user/signup", authData)
      .subscribe(() => {
        this.router.navigate(['/']);
      }, error => {
        this.authStatusListener.next(false);
      });
  }

  login(email: string, password: string) {
    const authData:LoginData = { email: email, password: password};
    this.http.post<{token: string, expiresIn: number, userId: string}>("http://localhost:3000/api/user/login", authData)
      .subscribe(response => {
        console.log(response);
        this.token = response.token;
        if (this.token) {
          const expiresInDuration = response.expiresIn;
          this.setAuthTimer(expiresInDuration);
          this.isAuthenticated = true;
          this.userId = response.userId;
          const now = new Date();
          const expirationDate = new Date(now.getTime() + expiresInDuration * 1000);
          console.log(expirationDate);
          this.saveAuthData(this.token, expirationDate, this.userId);
          this.authStatusListener.next(true);
          this.router.navigate(['/']);
        }
      }, error => {
        this.authStatusListener.next(false);
      });
  }

  autoAuthUser(){
    const authData = this.getAuthData();
    if (!authData){
      return;
    }
    const now = new Date();
    const expiresIn = authData.expirationDate.getTime() - now.getTime();
    if (expiresIn > 0){
      this.token = authData.token;
      this.isAuthenticated = true;
      this.userId = authData.userId;
      this.setAuthTimer(expiresIn / 1000);
      this.authStatusListener.next(true);
    }
  }

  private setAuthTimer(duration: number){
    console.log('Settig timer for: ' + duration);
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }

  logout() {
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    this.userId = null;
    this.clearAuthData();
    this.router.navigate(['/']);
    clearTimeout(this.tokenTimer);
  }

  private saveAuthData(token: string, expirationDate: Date, userId: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
    localStorage.setItem('userId', userId);
  }

  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
    localStorage.removeItem('userId');
  }

  private getAuthData() {
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiration');
    const userId = localStorage.getItem('useId');
    if (!token || !expirationDate){
      return;
    }
    return {
      token: token,
      expirationDate: new Date(expirationDate),
      userId: userId
    };
  }
 }
