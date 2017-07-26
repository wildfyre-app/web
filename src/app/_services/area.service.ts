import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Observable } from 'rxjs';
import { HttpService } from '.';
import { Area, Reputation } from '../_models';

@Injectable()
export class AreaService {
  public areas: Observable<Area[]>;
  public isAreaChecked = false;
  public currentAreaName = 'fun';

  public constructor(
    private httpService: HttpService
  ) { }

  getAreas(): Observable<Area[]> {
    // get areas from api
    return this.httpService.GET('/areas/')
      .map((response: Response) => response.json());
  }

  getAreaRep(area: string): Observable<Reputation> {
    return this.httpService.GET('/areas/' + area + '/rep/')
      .map((response: Response) => response.json());
  }
}
