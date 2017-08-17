import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Observable } from 'rxjs';
import { HttpService } from './http.service';
import { Choice } from '../_models/choice';

@Injectable()
export class ReasonService {
  flagChoices: Choice[] = [];

  constructor(
    private httpService: HttpService
  ) { }

  getFlagReasons(): Observable<Choice[]> {
    // get flag reasons from api
    return this.httpService.GET('/choices/flag/reasons/')
      .map((response: Response) => {
        const choices: Choice[] = [];
        response.json().forEach((choice: any) => {
          choices.push(Choice.parse(choice));
        });
      return choices;
    });
  }
}
