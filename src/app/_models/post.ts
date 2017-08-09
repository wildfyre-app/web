import {Author, Comment} from './';

export class Post {
  public created: Date;

  static parse(obj: any) {
    return new Post(
      obj.id,
      Author.parse(obj.author),
      obj.subscribed,
      obj.created,
      obj.active,
      obj.text,
      (() => {
        const comments: Comment[] = [];
        obj.comments.forEach((comment: any) => {
          comments.push(Comment.parse(comment));
        });
        return comments;
      })()  // Call method
    );
  }

  constructor(
    public id: number,
    public author: Author,
    public subscribed: boolean,
    created: string,
    public active: boolean,
    public text: string,
    public comments: Comment[]
  ) {
    this.created = new Date(created);

    // sort comments
    comments.sort((a: Comment, b: Comment) => {
      return a.created.getTime() - b.created.getTime();
    });
  }

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
