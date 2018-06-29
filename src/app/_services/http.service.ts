import { Http, Headers, RequestOptions } from '@angular/http';
import { Injectable } from '@angular/core';
import { isDevMode } from '@angular/core';
import { MdSnackBar } from '@angular/material';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { AuthenticationService } from './authentication.service';

@Injectable()
export class HttpService {
  private apiURL: string;

  constructor(
    private http: Http,
    private router: Router,
    private snackBar: MdSnackBar,
    private authenticationService: AuthenticationService
  ) {
    this.apiURL = 'https://api.wildfyre.net';
    if (isDevMode()) {
      this.apiURL = 'http://localhost:8000';
    }
  }
  // HTTP Requests
  DELETE(passedUrl: string): Observable<void> {
    // DELETE to api
    return this.http.delete(this.apiURL + passedUrl, this.getOptions())
      .catch((error: any) => this.handleError(error));
  }

  GET(passedUrl: string): Observable<any> {
    // get GET from api
    return this.http.get(this.apiURL + passedUrl, this.getOptions())
      .catch((error: any) => this.handleError(error));
  }

  OPTIONS(passedUrl: string): Observable<any> {
    // OPTIONS to api
    return this.http.options(this.apiURL + passedUrl, this.getOptions())
      .catch((error: any) => this.handleError(error));
  }

  PATCH(passedUrl: string, body: any): Observable<any> {
    // PATCH to api
    return this.http.patch(this.apiURL + passedUrl, JSON.stringify(body), this.getOptions())
      .catch((error: any) => this.handleError(error));
  }

  POST(passedUrl: string, body: any): Observable<any> {
    // POST to api
    return this.http.post(this.apiURL + passedUrl, JSON.stringify(body), this.getOptions())
      .catch((error: any) => this.handleError(error));
  }

  POST_IMAGE(passedUrl: string, body: any): Observable<any> {
    // POST to api
    return this.http.post(this.apiURL + passedUrl, body, this.getOptionsForImage())
      .catch((error: any) => this.handleError(error));
  }

  PUT(passedUrl: string, body: any): Observable<any> {
    // PUT to api
    return this.http.put(this.apiURL + passedUrl, JSON.stringify(body), this.getOptions())
      .catch((error: any) => this.handleError(error));
  }

  PUT_IMAGE(passedUrl: string, body: any): Observable<any> {
    // PUT to api
    return this.http.put(this.apiURL + passedUrl, body, this.getOptionsForImage())
      .catch((error: any) => this.handleError(error));
  }

  // Handling methods
  private handleError(error: any): Observable<any> {
    let message: string;
    let action = 'Close';
    let onAction: Function;

    if (!navigator.onLine) {
      this.snackBar.open('Your internet appears to be down', action, {
        duration: 20000
      });
    }

    switch (error.status) {
      // 4xx Client errors
      case 401:
        message = 'Authentication required.';
        action = 'Login';

        const router = this.router;
        onAction = function() {
          router.navigate(['/login']);
        };
        break;
      case 403:
        message = 'You are not allowed to do this!';
        break;
      case 404:
        message = 'The server couldn\'t find the resource you requested.';
        break;
      case 408:
        message = 'Request timed out.';
        break;

      // Errors that indicate bugs
      case 405:
      case 410:
      case 411:
      case 415:
      case 431:
      case 505:
        message = 'Oops, an error occured! Please submit a bug report';
        action = 'Report!';
        onAction = function() {
          location.href = 'mailto:bugs@wildfyre.net';
        };
        break;

      // 5xx Server errors
      case 500:
        message = 'Fatal error on our end. We are already notified!';
        break;
      case 503:
        message = 'Service unavailable. Updating / Overloaded.';
        break;

      default:
        return Observable.throw(error);
    }

    // Show snack Snackbar
    const snackBarRef = this.snackBar.open(message, action, {
      duration: 5000
    });

    if (onAction != null) {
      snackBarRef.onAction().subscribe(() => { onAction(); });
    }

    // Throw the Observable for the request
    return Observable.throw(error);
  }

  getOptions(headers?: Headers|null): RequestOptions {
    headers = headers || new Headers();

    // Set Content-Type to JSON if not already set
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

  getOptionsForImage(headers?: Headers|null): RequestOptions {
    headers = headers || new Headers();

    // Add Token if available
    if (this.authenticationService.token != null) {
      headers.append('Authorization', 'Token ' + this.authenticationService.token);
    }

    return new RequestOptions({
      headers: headers
    });
  }
}
