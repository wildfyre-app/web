import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Observable } from 'rxjs';
import { Comment } from '../_models/comment';
import { Area } from '../_models/area';
import { Reputation } from '../_models/reputation';
import { Post } from '../_models/post';
import { HttpService } from './http.service';

@Injectable()
export class CommentService {

  public constructor(
    private httpService: HttpService
  ) { }

  deleteComment(currentArea: string, post: Post, comment: Comment): void {
    this.httpService.DELETE('/areas/' + currentArea + '/' + post.id + '/' + comment.id + '/')
      .subscribe();
    post.comments.splice(post.comments.indexOf(comment), 1);
  }
}
