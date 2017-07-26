import {Author, Comment} from './index';

export class Post {
  constructor(
    public id: number,
    public author: Author,
    public subscribed: boolean,
    public created: string,
    public active: boolean,
    public text: string,
    public comments: Comment[]
  ) { }

  getError(): PostError {
    return null;
  }
}

export class PostError extends Post {
  constructor(
    public non_field_errors?: string[],
    public _text?: string[]
  ) {
    super(null, null, null, null, null, null, null);
  }

  getError(): PostError {
    return this;
  }
}
