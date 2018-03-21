import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Observable } from 'rxjs';
import { HttpService } from './http.service';
import { Area } from '../_models/area';
import { Reputation } from '../_models/reputation';

@Injectable()
export class AreaService {
  public areas: Area[];
  public currentAreaName = 'fun';
  public isAreaChecked = false;
  private reputation: { [area: string]: Reputation; } = { };

  public constructor(
    private httpService: HttpService
  ) { }

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

  getAreas(): Observable<Area[]> {
    // get areas from api
    if (!this.areas) {
    return this.httpService.GET('/areas/')
      .map((response: Response) => {
        const areas: Area[] = [];
        response.json().forEach((area: any) => {
            this.getAreaRep(area.name).subscribe();
            areas.push(Area.parse(area));
            this.areas = areas;
        });
        return areas;
      });
    } else {
      return Observable.of(this.areas);
    }
  }
}
