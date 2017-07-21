import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { AuthenticationService } from './index';
import { isDevMode } from '@angular/core';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class HttpService {
  private apiURL: string;

  constructor(
    private http: Http,
    private authenticationService: AuthenticationService
  ) {
    this.apiURL = 'https://api.wildfyre.net';
    if (isDevMode()) {
      this.apiURL = 'http://localhost:8000';
    }
  }

  getOptions(headers?: Headers|null): RequestOptions {
    headers = headers || new Headers();

    // Set Content-Type to JSON if not alread set
    if (!headers.has('Content-Type')) {
      headers.append('Content-Type', 'application/json');
    }

    // Add Token if available
    if (this.authenticationService.token != null) {
      headers.append('Authorization', 'Token ' + this.authenticationService.token);
    }

    return new RequestOptions({
      headers: headers
    });
  }

  POST(passedUrl: string, body: any): Observable<any> {
    // POST to api
    body = JSON.stringify(body);

    return this.http.post(this.apiURL + passedUrl, body, this.getOptions())
    .catch((error: any) => {
      if (error.status !== 201 || error.status !== 200) {
        return Observable.throw(new Error(error.status));
      }
  });
  }

  GET(passedUrl: string): Observable<any> {
    // get GET from api
    return this.http.get(this.apiURL + passedUrl, this.getOptions())
    .catch((error: any) => {
      if (error.status !== 201 || error.status !== 200 ) {
        return Observable.throw(new Error(error.status));
      }
  });
  }

  PATCH(passedUrl: string, body: any): Observable<any> {
    // PATCH to api
    body = JSON.stringify(body);

    return this.http.patch(this.apiURL + passedUrl, body, this.getOptions())
    .catch((error: any) => {
      if (error.status !== 201 || error.status !== 200) {
        return Observable.throw(new Error(error.status));
      }
  });

  }
}
