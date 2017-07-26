import {Author} from './index';

export class Comment {
  constructor(
    public id: number,
    public author: Author,
    public created: string,
    public text: string
  ) { }

  getError(): CommentError {
    return null;
  }
}

export class CommentError extends Comment {
  constructor(
    public non_field_errors?: string[],
    public _text?: string[]
  ) {
    super(null, null, null, null);
  }

  getError(): CommentError {
    return this;
  }
}
