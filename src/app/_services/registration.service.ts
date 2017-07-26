import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Observable } from 'rxjs';
import { HttpService} from './index';
import { Registration, RegistrationError } from '../_models';

@Injectable()
export class RegistrationService {
  public token: string;

  constructor(
    private httpService: HttpService
  ) { }

  register(username: string, email: string, password: string, captchaResponse: String): Observable<Registration> {
    const body = {
      'username': username,
      'email': email,
      'password': password,
      'captcha': captchaResponse
    };

    return this.httpService.POST('/account/register/', body)
      .map((response: Response) => {
        // Registration successful
        return new Registration();
      })
      .catch((error) => {
        return Observable.of(
          new RegistrationError(
            JSON.parse(error._body).non_field_errors,
            JSON.parse(error._body).username,
            JSON.parse(error._body).email,
            JSON.parse(error._body).password,
            JSON.parse(error._body).captcha
          )
        );
      });
  }
}
