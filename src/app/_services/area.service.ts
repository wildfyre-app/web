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
  private reputation: { [area: string]: Reputation; } = { };

  public constructor(
    private httpService: HttpService
  ) { }

  getAreas(): Observable<Area[]> {
    // get areas from api
    return this.httpService.GET('/areas/')
      .map((response: Response) => {
        const areas: Area[] = [];
        response.json().forEach((area: any) => {
            areas.push(Area.parse(area));
        });
        return areas;
      });
  }

  getAreaRep(area: string): Observable<Reputation> {
    if (this.reputation[area]) {
      return Observable.of(this.reputation[area]);
    } else {
      return this.httpService.GET('/areas/' + area + '/rep/')
        .map((response: Response) => {
          this.reputation[area] = Reputation.parse(response.json());
          return this.reputation[area];
        });
    }
  }
}
