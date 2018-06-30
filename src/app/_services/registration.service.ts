import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { Response } from '@angular/http';
import { Observable } from 'rxjs';
import { Registration, RegistrationError } from '../_models/registration';
import { Reset, ResetError } from '../_models/reset';
import { RecoverTransaction, RecoverTransactionError } from '../_models/recoverTransaction';
import { HttpService } from './http.service';

@Injectable()
export class RegistrationService {
  constructor(
    private snackBar: MatSnackBar,
    private httpService: HttpService
  ) { }

  recoverPasswordStep1(email: string, username: string, captchaResponse: String): Observable<RecoverTransaction> {
    const body = {
      'email': email,
      'username': username,
      'captcha': captchaResponse
    };

    return this.httpService.POST('/account/recover/', body)
      .map((response: Response) => {
        // Step 1 successful
        return RecoverTransaction.parse(response);
      })
      .catch((error) => {
        return Observable.of(
          new RecoverTransactionError(
            JSON.parse(error._body).non_field_errors,
            JSON.parse(error._body).email,
            JSON.parse(error._body).captcha
          )
        );
      });
  }

  recoverPasswordStep2(password: string, token: string, transactionID: string, captchaResponse: String): Observable<Reset> {
    const body = {
      'new_password': password,
      'token': token,
      'transaction': transactionID,
      'captcha': captchaResponse
    };

    return this.httpService.POST('/account/recover/reset/', body)
      .map((response: Response) => {
        // Password reset successful
        return Reset.parse(response);
      })
      .catch((error) => {
        return Observable.of(
          new ResetError(
            JSON.parse(error._body).non_field_errors,
            JSON.parse(error._body).new_password,
            JSON.parse(error._body).token,
            JSON.parse(error._body).transaction,
            JSON.parse(error._body).captcha
          )
        );
      });
  }

  recoverUsername(email: string, captchaResponse: String) {
    const body = {
      'email': email,
      'captcha': captchaResponse
    };

    return this.httpService.POST('/account/recover/', body)
      .map((response: Response) => {
        // Usernames sent successfully
        return RecoverTransaction.parse(response);
      })
      .catch((error) => {
        return Observable.of(
          new RecoverTransactionError(
            JSON.parse(error._body).non_field_errors,
            JSON.parse(error._body).username,
            JSON.parse(error._body).email,
            JSON.parse(error._body).captcha
          )
        );
      });
  }

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
        return Registration.parse(response);
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
