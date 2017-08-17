import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Observable } from 'rxjs';
import { HttpService } from './http.service';
import { Author, AuthorError } from '../_models/author';

@Injectable()
export class ProfileService {
  private self: Author;

  constructor(
    private httpService: HttpService
  ) {}

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
}
