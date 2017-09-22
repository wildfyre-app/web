import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import { Area } from '../_models/area';
import { Comment, CommentError } from '../_models/comment';
import { Post, PostError } from '../_models/post';
import { AreaService } from './area.service';
import { HttpService } from './http.service';

@Injectable()
export class PostService {
  private queuedPosts: { [area: string]: Post[]; } = {};
  private used: { [area: string]: number[]; } = {};

  constructor(
    private httpService: HttpService
  ) { }

  getNextPost(area: string): Observable<Post> {
    if (!this.used[area]) {
      this.used[area] = [];
    }

    if (!this.queuedPosts[area]) {
      this.queuedPosts[area] = [];
    }

    if (this.queuedPosts[area].length !== 0) {
      // Update stack and return first post
      const nextPost: Post = this.queuedPosts[area].pop();

      if (this.queuedPosts[area].length < 3) {
        this.getPosts(area)
          .subscribe();
      }

      if (this.used[area].indexOf(nextPost.id) === -1) {
        this.used[area].push(nextPost.id);
        return Observable.of(nextPost);
      } else {
        return this.getNextPost(area);
      }
    } else {
      // Update queue
      return this.getPosts(area)
        .flatMap(result => {
        if (result !== null) {
          return this.getNextPost(area);
        } else {
          return Observable.of(null);
        }
      });
    }
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

  deletePost(area: string, post: Post) {
    this.httpService.DELETE('/areas/' + area + '/' + post.id + '/')
      .subscribe();
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

  getPost(areaID: string, postID: string): Observable<Post> {
    return this.httpService.GET('/areas/' + areaID + '/' + postID + '/')
      .map((response: Response) => {
        return Post.parse(response.json());
      });
  }

  private getPosts(area: string): Observable<Post[]> {
    return this.httpService.GET('/areas/' + area + '/')
      .map((response: Response) => {

        const posts: Post[] = [];

        response.json().forEach((obj: any) => {
          posts.push(Post.parse(obj));
        });

        // Cache
        if (posts.length !== 0) {
          this.queuedPosts[area] = posts;
          return posts;
        } else {
          return null;
        }
      });
    }

  spread(area: string, post: Post, spread: boolean): void {
    const body = {
      'spread': spread
    };
    this.httpService.POST('/areas/' + area +
      '/' + post.id + '/spread/', body)
        .subscribe();
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
}
