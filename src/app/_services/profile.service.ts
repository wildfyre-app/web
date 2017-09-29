import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Observable } from 'rxjs';
import { Account, AccountError } from '../_models/account';
import { Author, AuthorError } from '../_models/author';
import { HttpService } from './http.service';

@Injectable()
export class ProfileService {
  private self: Author;

  constructor(
    private httpService: HttpService
  ) {}

  getAccount(): Observable<Account> {
    return this.httpService.GET('/account/')
      .map((response: Response) => {
        return Account.parse(response.json());
      });
  }

  getSelf(): Observable<Author> {
    if (this.self) {
      return Observable.of(this.self);
    } else {
      return this.httpService.GET('/users/')
        .map((response: Response) => {
          this.self = Author.parse(response.json());  // cache
          return this.self;
        });
    }
  }

  getUser(id: string): Observable<Author> {
    return this.httpService.GET('/users/' + id)
      .map((response: Response) => {
        return Author.parse(response.json());
      });
  }

  setBio(author: Author, bio: any): Observable<Author> {
    author.bio = bio;

    const body = {
      bio: bio
    };

    return this.httpService.PATCH('/users/', body)
      .map((response: Response) => {
        console.log('You leveled up some stats');

        return Author.parse(response.json());
      }).catch((err) => {
        return Observable.of(new AuthorError(
          JSON.parse(err._body).non_field_errors,
          JSON.parse(err._body).text
        ));
      });
  }

  setEmail(email: any): Observable<Account> {
    const body = {
      email: email
    };

    return this.httpService.PATCH('/account/', body)
      .map((response: Response) => {
        console.log('You have mail!');

        return Account.parse(response.json());
      }).catch((err) => {
        return Observable.of(new AccountError(
          JSON.parse(err._body).non_field_errors,
          JSON.parse(err._body).text
        ));
      });
  }

  setPassword(password: any): Observable<Account> {
    const body = {
      password: password
    };

    return this.httpService.PATCH('/account/', body)
      .map((response: Response) => {
        console.log('You have been securely encryptified');

        return Account.parse(response.json());
      }).catch((err) => {
        return Observable.of(new AccountError(
          JSON.parse(err._body).non_field_errors,
          JSON.parse(err._body).text
        ));
      });
  }
}
