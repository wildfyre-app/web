import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { HttpService } from './index';
import { Author } from '../_models/index';

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
}
