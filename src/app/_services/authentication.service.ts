import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs';
import { isDevMode } from '@angular/core';
import { Auth, AuthError } from '../_models';
import 'rxjs/add/operator/map';

@Injectable()
export class AuthenticationService {
  public token: string;
  private apiURL: string;

  constructor(
    private http: Http
  ) {
    // set token if saved in local storage
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.token = currentUser && currentUser.token;
    this.apiURL = 'https://api.wildfyre.net';
    if (isDevMode()) {
      this.apiURL = 'http://localhost:8000';
    }
  }

  login(username: string, password: string): Observable<Auth> {
    const options = new RequestOptions({headers: new Headers({'Content-Type': 'application/json'})});

    return this.http.post(this.apiURL + '/account/auth/', JSON.stringify({ username: username, password: password }), options)
      .map((response: Response) => {
        // set token property
        this.token = response.json().token;
        // store username and token in local storage to keep user logged in between page refreshes
        localStorage.setItem('currentUser', JSON.stringify({ username: username, token: this.token }));

        return Auth.parse(response.json());
      })
      .catch((error) => {
        const body = JSON.parse(error._body);
        return Observable.of(
          new AuthError(
            body.non_field_errors || null,
            body.username || null,
            body.password || null
          )
        );
      });
  }

  logout(): void {
    // clear token remove user from local storage to log user out
    this.token = null;
    localStorage.removeItem('currentUser');
  }
}
