import {Author} from './author';

export class Comment {
  static parse(obj: any) {
    return new Comment(
      obj.id,
      obj.author,
      obj.created,
      obj.text,
      obj.image
    );
  }

  constructor(
    public id: number,
    public author: Author,
    public created: string,
    public text: string,
    public image: string
  ) {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    const time = new Date(created);
    this.created = time.toLocaleDateString(undefined, options);
  }

  getError(): CommentError {
    return null;
  }
}

export class CommentError extends Comment {
  constructor(
    public non_field_errors?: string[],
    public _text?: string[]
  ) {
    super(null, null, null, null, null);
  }

  getError(): CommentError {
    return this;
  }
}
