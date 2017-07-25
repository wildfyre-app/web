import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { HttpService } from './index';
import { Area, Reputation } from '../_models/index';

@Injectable()
export class AreaService {
  public areas: Observable<Area[]>;
  public subject: Subject<Area[]> = new Subject();
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
