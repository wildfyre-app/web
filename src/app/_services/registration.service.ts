import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { HttpService} from './index';
import 'rxjs/add/operator/map';

@Injectable()
export class RegistrationService {
  public token: string;

  constructor(
    private httpService: HttpService
  ) { }

  register(username: string, email: string, password: string, captchaResponse: String): Observable<boolean> {
    const text = {
      'username': username,
      'email': email,
      'password': password,
      'captcha': captchaResponse
    };

    return this.httpService.POST('/account/register/', text)
      .map((response: Response) => {
        // Registration successful
        return true;
      });
  }
}
