import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { HttpService } from './index';
import { Author, AuthorError } from '../_models/index';

@Injectable()
export class ProfileService {
  constructor(
    private httpService: HttpService
  ) {}

  getSelf(): Observable<Author> {
    // get profile from api
    return this.httpService.GET('/users/')
      .map((response: Response) => response.json());
  }
  setBio(_author: Author, text: any): Observable<Author> {
      _author.bio = text;
    return this.httpService.PATCH('/users/', text)
    .map((response: Response) => {
      const author = new Author(
        response.json().user,
        response.json().name,
        response.json().avatar,
        response.json().bio,
        response.json().banned,
      );

      console.log('You leveled up some stats');
      return author;
    }).catch((err) => {
      return Observable.of(new AuthorError(
        JSON.parse(err._body).non_field_errors,
        JSON.parse(err._body).text
      ));
    });

  }

  getUser(id: string): Observable<Author> {
    return this.httpService.GET('/users/' + id)
      .map((response: Response) => response.json());
  }

}
