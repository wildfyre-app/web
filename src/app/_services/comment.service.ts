import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Observable } from 'rxjs';
import { HttpService } from '.';
import { Area, Reputation, Post, Comment } from '../_models';

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
