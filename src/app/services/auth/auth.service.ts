import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { catchError, map } from 'rxjs/operators';
import { throwError, BehaviorSubject, Subject } from 'rxjs';
import { UserData } from '../../models/userData';
import { Router } from '@angular/router';

interface UserResponse {
  name: string;
  email: string;
  token: string;
  tokenExpiresOn: number;
}

@Injectable({ providedIn: 'root' })
// tslint:disable: deprecation
// tslint:disable: max-line-length
// tslint:disable: variable-name
export class AuthService {
  private SIGNUP_API = environment.BACKEND_BASE + environment.SIGNUP;
  private LOGIN_API = environment.BACKEND_BASE + environment.LOGIN;
  private LOGOUT_API = environment.BACKEND_BASE + environment.LOGOUT;
  private USERS_API = environment.BACKEND_BASE + environment.USERS;
  private userData: UserData | undefined;
  private userToken: string | undefined;
  private userTokenExpiresOn: number | undefined;
  private tokenExpirationTimer: any;
  authenticatedUser: BehaviorSubject<UserData | undefined>;
  userLogOut: Subject<string>;

  constructor(private http: HttpClient, private router: Router) {
    this.authenticatedUser = new BehaviorSubject(this.userData);
    this.userLogOut = new Subject();
    const dataString = localStorage.getItem('user');
    if (dataString) {
      this.loadUser(JSON.parse(dataString));
    }
  }

  logIn = (email: string, password: string) => this.postBackend(this.LOGIN_API, { email, password });

  signUp = (name: string, email: string, password: string) => this.postBackend(this.SIGNUP_API, { name, email, password });

  update = (data: { name: string, email: string }) => {
    return this.http
      .patch<any>(this.USERS_API, data)
      .pipe(
        map(user => {
          this.userData = new UserData(user.name, user.email);
          const localUser = JSON.parse(localStorage.getItem('user') || '{}');
          localUser.name = this.userData.name;
          localUser.email = this.userData.email;
          this.authenticatedUser.next(this.userData);
          return this.userData;
        }),
        catchError(this.handleError)
      );
  }

  updatePass = (data: { oldPassword: string, newPassword: string }) => {
    return this.http
      .put<any>(this.USERS_API, data)
      .pipe(catchError(this.handleError));
  }

  delete = () => {
    this.http
      .delete<any>(this.USERS_API)
      .pipe(catchError(this.handleError))
      .subscribe(_data => this.logout('delete'));
  }

  get JWTtoken(): string | undefined {
    return this.userToken;
  }

  logout = (type: string = 'manual') => {
    if (type === 'manual') {
      this.http.post<any>(this.LOGOUT_API, '').subscribe(_resp => { });
    }
    this.userData = undefined;
    this.userToken = undefined;
    localStorage.removeItem('user');
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
    this.tokenExpirationTimer = null;
    this.authenticatedUser.next(this.userData);
    this.userLogOut.next(type);
    this.router.navigate(['home']);
  }

  private postBackend = (api: string, body: any) => {
    return this.http
      .post<UserResponse>(api, body)
      .pipe(
        map(user => {
          this.loadUser(user);
          localStorage.setItem('user', JSON.stringify(user));
          return this.userData;
        }),
        catchError(this.handleError)
      );
  }

  private loadUser = (user: UserResponse) => {
    this.userData = new UserData(user.name, user.email);
    this.userToken = user.token;
    this.userTokenExpiresOn = user.tokenExpiresOn;
    this.autoLogout(this.userTokenExpiresOn - Date.now());
    this.authenticatedUser.next(this.userData);
  }

  private autoLogout = (expirationDuration: number) => this.tokenExpirationTimer = setTimeout(() => this.logout('auto'), expirationDuration);

  private handleError = (errorRes: HttpErrorResponse) => throwError(errorRes.error);
}
