import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { catchError, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { JWT_TOKEN_NAME } from '../constants/jwt-token-name.constant';

@Injectable()
export class AuthService {
  protected authenticationState$: BehaviorSubject<boolean>;

  constructor(
    private readonly http: HttpClient,
    private readonly router: Router,
    private readonly snackBar: MatSnackBar,
  ) {
    this.authenticationState$ = new BehaviorSubject<boolean>(this.isAuthenticated());
  }
  
  public setAuthenticationState(state: boolean): void {
    this.authenticationState$.next(state);
  }
  
  public isAuthenticated(): boolean {
    return !!localStorage.getItem(JWT_TOKEN_NAME);
  }
  
  public login(email: string, password: string): Observable<any> {
    const customHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json'
    });
    
    return this.http
      .post<any>(`${environment.baseUrl}/auth/login`, {
        email: email,
        password: password,
      }, {
        headers: this.getHeaders(customHeaders)
      }).pipe(
        map((result: any) => {
          this.onSuccessfulLogin(result.token);
        }),
        catchError(this.handleError),
      );
  }
 
  public onSuccessfulLogin(token: string): void {
    localStorage.setItem(JWT_TOKEN_NAME, token);

    this.setAuthenticationState(true);

    this.router.navigateByUrl('/');
  }
  
  public register(body): Observable<any> {
    const customHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json'
    });
    
    return this.http
      .post<any>(`${environment.baseUrl}/auth/register`, body, {
        headers: this.getHeaders(customHeaders)
      })
      .pipe(
        map((result: any) => {
          this.onSuccessfulLogin(result.token);
        }),
        catchError(this.handleError)
      );
  }

  public logout(): Observable<boolean> {
    return this.http
      .post(`${environment.baseUrl}/auth/logout`, null, {
        headers: this.getHeaders()
      })
      .pipe(
        map((result: any) => {
          if (result.success) {
            this.removeStaleCredentials();
            this.setAuthenticationState(false);

            return true;
          }

          return false;
        }),
        catchError(this.handleError)
      );
  }

  public getToken(): string {
    return localStorage.getItem(JWT_TOKEN_NAME);
  }

  public removeStaleCredentials(): void {
    localStorage.removeItem(JWT_TOKEN_NAME);
  }

  public getHeaders(customHeaders?: HttpHeaders): HttpHeaders {
    if (customHeaders) {
      return customHeaders;
    }

    return new HttpHeaders({
      Authorization: 'Bearer ' + this.getToken(),
      'Content-Type': 'application/json',
      Accept: 'application/json'
    });
  }

  private handleError(error: any): Observable<never> {
    if (error?.error?.message) {
      this.snackBar?.open(error.error.message, 'Splash', {
        horizontalPosition: 'end',
        verticalPosition: 'top',
      });
    }
    return throwError(error);
  }
}
