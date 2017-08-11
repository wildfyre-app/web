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
  private used: { [area: string]: number[]; } = { };
  private lowStack: { [area: string]: boolean; } = { }; // low stack on server

  constructor(
    private httpService: HttpService
  ) { }

  private use(area: string, post: Post) {
    if (!this.used[area]) { this.used[area] = []; }
    this.used[area].push(post.id);
    this.posts[area].splice(this.posts[area].indexOf(post), 1);
  }

  getPosts(area: string): Observable<Post[]> {
    return this.httpService.GET('/areas/' + area + '/')
      .map((response: Response) => {
        const posts: Post[] = [];

        response.json().forEach((obj: any) => {
          if (this.used[area] && obj.id in this.used[area]) { return; }
          posts.push(Post.parse(obj));
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
      // Update stack and return first post
      return this.getPosts(area)
        .map((posts: Post[]) => {
          if (posts.length === 0) { return null; }

          const post = posts[0];
          this.use(area, post);
          return post;
        });
    } else {
      if (this.posts[area].length < 3 && !this.lowStack[area]) {
        // Stack is low. Update posts but still return form cache
        this.getPosts(area).subscribe();
      }

      const post = this.posts[area][0];
      this.use(area, post);
      return Observable.of(post);
    }
  }

  getPost(areaID: string, postID: string): Observable<Post> {
    return this.httpService.GET('/areas/' + areaID + '/' + postID + '/')
      .map((response: Response) => {
        return Post.parse(response.json());
      });
  }

  createPost(area: string, text: string): Observable<Post> {
    const body = {
      'text': text
    };

    return this.httpService.POST(
      '/areas/' + area + '/', body)
      .map((response: Response) => {
        return Post.parse(response.json());
      })
      .catch((error) => {
        return Observable.of(new PostError(
          JSON.parse(error._body).non_field_errors,
          JSON.parse(error._body).username
        ));
      });

  }

  spread(area: string, post: Post, spread: boolean): void {
    const body = {
      'spread': spread
    };
    this.httpService.POST('/areas/' + area +
      '/' + post.id + '/spread/', body)
        .subscribe(() => {
          setTimeout(() => {  // Wait five secound because of network latency
            // Cleanup used array
            this.used[area].splice(this.used[area].indexOf(post.id), 1);
          }, 5000);
        });
  }

  comment(area: string, post: Post, text: string): Observable<Comment> {
    post.subscribed = true;

    const body = {
      'text': text
    };

    return this.httpService.POST('/areas/' + area + '/' + post.id + '/', body)
      .map((response: Response) => {
        const comment = Comment.parse(response.json());

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

  getOwnPosts(area: string): Observable<Post[]> {
    return this.httpService.GET('/areas/' + area + '/own/')
      .map((response: Response) => {
        const posts: Post[] = [];
        response.json().forEach((post: any) => {
          posts.push(post);
        });
        return posts;
      });
  }

  subscribe(area: string, post: Post, subscribe: boolean): Observable<void> {
    post.subscribed = subscribe;

    const body = {
      'subscribed': subscribe
    };

    return this.httpService.PUT('/areas/' + area + '/' + post.id + '/subscribe/', body)
      .map((response: Response) => {
        if (subscribe) {
          console.log('You started following someone in the woods');
        } else {
          console.log('You left someone in the woods');
        }
      });
  }

  deletePost(area: string, post: Post) {
    this.httpService.DELETE('/areas/' + area + '/' + post.id + '/')
      .subscribe();
  }
}
