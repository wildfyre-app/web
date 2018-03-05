import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import { Area } from '../_models/area';
import { Comment, CommentError } from '../_models/comment';
import { Post, PostError } from '../_models/post';
import { SuperPost } from '../_models/superPost';
import { AreaService } from './area.service';
import { HttpService } from './http.service';

@Injectable()
export class PostService {
  private queuedPosts: { [area: string]: Post[]; } = {};
  private used: { [area: string]: number[]; } = {};
  superPosts: { [area: string]: SuperPost; } = {};

  constructor(
    private httpService: HttpService
  ) { }

  private getPosts(area: string): Observable<Post[]> {
    return this.httpService.GET('/areas/' + area + '/?limit=10')
      .map((response: Response) => {
        const superPost: SuperPost = SuperPost.parse(response.json());
        const posts: Post[] = [];

        superPost.results.forEach((obj: any) => {
          posts.push(Post.parse(obj));
        });

        // Cache
        if (superPost.count !== 0) {
          this.queuedPosts[area] = posts;
          return posts;
        } else {
          return null;
        }
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

  createPost(area: string, text: string, anonymous: boolean): Observable<Post> {
    const body = {
      'anonym': anonymous,
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
          JSON.parse(error._body)._text
        ));
      });
  }

  deletePost(area: string, post: Post) {
    this.httpService.DELETE('/areas/' + area + '/' + post.id + '/')
      .subscribe();
  }

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

  getOwnPosts(area: string, limit: number, offset: number): Observable<SuperPost> {
      return this.httpService.GET('/areas/' + area + '/own/?limit=' + limit + '&offset=' + offset)
        .map((response: Response) => {
          this.superPosts[area] = SuperPost.parse(response.json());

          return this.superPosts[area];
      });
  }

  getPost(areaID: string, postID: string): Observable<Post> {
    return this.httpService.GET('/areas/' + areaID + '/' + postID + '/')
      .map((response: Response) => {
        return Post.parse(response.json());
      });
  }

  spread(area: string, post: Post, spread: boolean): void {
    const body = {
      'spread': spread
    };

    this.used[area].push(post.id);

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
