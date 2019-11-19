import { Injectable } from '@angular/core';
import { isDevMode } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Auth, AuthError} from '../_models/auth';

@Injectable()
export class AuthenticationService {
  private apiURL: string;
  public token: string;

  constructor(
    private http: HttpClient
  ) {
    // set token if saved in local storage
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.token = currentUser && currentUser.token;
    this.apiURL = 'https://api.wildfyre.net';
    // if (isDevMode()) {
    //   this.apiURL = 'http://localhost:8000';
    // }
  }

  login(username: string, password: string): Observable<Auth> {
    const options = { headers: new HttpHeaders({ 'Content-Type': 'application/json'}) };

    return this.http.post(this.apiURL + '/account/auth/', JSON.stringify({ username: username, password: password }), options).pipe(
      map((response: any) => {
        // set token property
        this.token = response.token;
        // store username and token in local storage to keep user logged in between page refreshes
        localStorage.setItem('currentUser', JSON.stringify({ username: username, token: this.token }));

        return Auth.parse(response);
      })).pipe(
      catchError((error) => {
        return of(
          new AuthError(
            error.error.non_field_errors,
            error.error.username,
            error.error.password,
          )
        );
      }));
  }

  logout(): void {
    // clear token remove user from local storage to log user out
    this.token = null;
    localStorage.removeItem('currentUser');
  }
}
