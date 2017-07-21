import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import { AreaService, HttpService} from './index';
import { Post, Area } from '../_models/index';

@Injectable()
export class PostService {
  areas: Area[] = [];

  constructor(
    private areaService: AreaService,
    private httpService: HttpService
  ) { }

  getPosts(): Observable<Post[]> {
    return this.httpService.GET('/areas/' + this.areaService.currentAreaName + '/')
      .map((response: Response) => response.json());
  }

  getPost(areaID: string, postID: string): Observable<Post> {
    // subscribe until the area is available
    return this.areaService.getAreas().mergeMap(area => {
      // use the area to get the response
      return this.httpService.GET('/areas/' + areaID + '/' + postID)
        .map((response: Response) => response.json());
    });
  }

  getFunPosts(): Observable<Post[]> {
    return this.httpService.GET('/areas/fun/own/')
      .map((response: Response) => response.json());
  }

  getInformationPosts(): Observable<Post[]> {
    return this.httpService.GET('/areas/information/own/')
      .map((response: Response) => response.json());
  }
}
