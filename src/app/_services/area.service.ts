import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpService } from './http.service';
import { Area } from '../_models/area';
import { Reputation } from '../_models/reputation';

@Injectable()
export class AreaService {
  public areas: Area[];
  public currentAreaName = '';
  public isAreaChecked = false;
  private reputation: { [area: string]: Reputation; } = { };

  public constructor(
    private httpService: HttpService
  ) { }

  getAreaRep(area: string): Observable<Reputation> {
    // Get area rep from api, cache response
    if (this.reputation[area]) {
      return of(this.reputation[area]);
    } else {
      return this.httpService.GET('/areas/' + area + '/rep/').pipe(
        map((response) => {
          this.reputation[area] = Reputation.parse(response);
          return this.reputation[area];
        }));
    }
  }

  getAreas(): Observable<Area[]> {
    // Get areas from api, cache response
    if (!this.areas) {
      return this.httpService.GET('/areas/').pipe(
        map(response => {
          const areas: Area[] = [];
          for (let i = 0; i < response.length; i++) {
            areas.push(Area.parse(response[i]));
          }
          this.areas = areas;
          return areas;
        }));
    } else {
      return of(this.areas);
    }
  }

  getArea(s: string): Observable<Area> {
    if (s === '_') {
      return of(new Area('_', 'All Posts', 0, 0));
    }
    if (!this.areas) {
      return this.getAreas().pipe(
        map(areas => {
          if (areas) {
            for (let i = 0; i < areas.length; i++) {
              if (areas[i].name === s) {
                return areas[i];
              }
            }
          }
        }));
    } else {
      for (let i = 0; i < this.areas.length; i++) {
        if (this.areas[i].name === s) {
          return of(this.areas[i]);
        }
      }
    }
  }
}
