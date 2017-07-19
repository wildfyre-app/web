import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { AuthenticationService } from './index';
import { isDevMode } from '@angular/core';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class HttpService {
  public token = '';
  private apiURL: string;
  private headers = new Headers();
  private options: RequestOptions;
    constructor(
    private http: Http,
    private authenticationService: AuthenticationService) {
    this.apiURL = 'https://api.wildfyre.net';
    if (isDevMode()) {
      this.apiURL = 'http://localhost:8000';
    }

    if (this.authenticationService.token != null) {
      this.headers.append('Authorization', 'token ' + this.authenticationService.token);
    }

    this.headers.append('Content-Type', 'application/json');

    this.options = new RequestOptions({
      headers: this.headers
    });
}

  POST(passedUrl: string, body: any): Observable<any> {
    // get POST from api
    return this.http.post(this.apiURL + passedUrl, body, this.options)
    .catch((error: any) => {
      if (error.status !== 201 || error.status !== 200) {
        return Observable.throw(new Error(error.status));
      }
  });
  }

  GET(passedUrl: string): Observable<any> {
    // get GET from api
    return this.http.get(this.apiURL + passedUrl, this.options)
    .catch((error: any) => {
      if (error.status !== 201 || error.status !== 200 ) {
        return Observable.throw(new Error(error.status));
      }
  });
  }
}
