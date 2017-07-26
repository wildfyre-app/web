import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import { AreaService, HttpService } from '.';
import { Post, PostError, Comment, CommentError, Area } from '../_models';

@Injectable()
export class PostService {
  private posts: { [area: string]: Post[]; } = { };
  private spreading: { [area: string]: number[]; } = { };
  private lowStack: { [area: string]: boolean; } = { }; // low stack on server

  constructor(
    private httpService: HttpService
  ) { }

  getPosts(area: string): Observable<Post[]> {
    return this.httpService.GET('/areas/' + area + '/')
      .map((response: Response) => {
        const posts: Post[] = [];

        response.json().forEach((obj: any) => {
          if (this.spreading[area] && obj.id in this.spreading[area]) { return; }

          posts.push(new Post(
            obj.id,
            obj.author,
            obj.subscribed,
            obj.created,
            obj.active,
            obj.text,
            obj.comments
          ));
        });

        // check stack size
        this.lowStack[area] = posts.length < 5;

        // cache
        this.posts[area] = posts;
        return posts;
      });
  }

  getNextPost(area: string): Observable<Post> {
    if (!(area in this.posts) || this.posts[area].length === 0) {
      // Update stock and return first post
      return this.getPosts(area)
        .map((posts: Post[]) => {
          return (posts.length > 0) ? posts[0] : null;
        });
    } else {
      if (this.posts[area].length < 3 && !this.lowStack[area]) {
        // Stack is low. Update posts but still return form cache
        this.getPosts(area).subscribe();
      }

      return Observable.of(this.posts[area][0]);
    }
  }

  getPost(areaID: string, postID: string): Observable<Post> {
    return this.httpService.GET('/areas/' + areaID + '/' + postID)
      .map((response: Response) => response.json());
  }

  createPost(area: string, text: string): Observable<Post> {
    const body = {
      'text': text
    };

    return this.httpService.POST(
      '/areas/' + area + '/', body)
      .map((response: Response) => {
        return new Post(
          response.json().id || null,
          response.json().author || null,
          response.json().subscribed || null,
          response.json().created || null,
          response.json().active || null,
          response.json().text || null,
          response.json().comments || null
        );
      })
      .catch((error) => {
        return Observable.of(new PostError(
          JSON.parse(error._body).non_field_errors || null,
          JSON.parse(error._body).username || null
        ));
      });

  }

  spread(area: string, post: Post, spread: boolean): void {
    // Save this, to filter out when updating stack cache
    if (!this.spreading[area]) {
      this.spreading[area] = [];
    }
    this.spreading[area].push(post.id);

    const sSpread = spread ? '1' : '0';
    this.httpService.POST('/areas/' + area +
      '/' + post.id + '/spread/' + sSpread + '/', {})
        .subscribe(() => {
          setTimeout(() => {  // Wait a secound because of network latency
            this.spreading[area].splice(this.spreading[area].indexOf(post.id), 1);
          }, 1000);
        });

    this.posts[area].splice(this.posts[area].indexOf(post), 1);
  }

  comment(area: string, post: Post, text: string): Observable<Comment> {
    const body = {
      'text': text
    };

    return this.httpService.POST('/areas/' + area + '/' + post.id + '/', body)
      .map((response: Response) => {
        const comment = new Comment(
          response.json().id,
          response.json().author,
          response.json().created,
          response.json().text
        );

        post.comments.push(comment);

        return comment;
      })
      .catch((err) => {
        return Observable.of(new CommentError(
          JSON.parse(err._body).non_field_errors,
          JSON.parse(err._body).text
        ));
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
