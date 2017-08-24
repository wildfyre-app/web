import {Post} from './';

export class Notification {
  static parse(obj: any) {
    return new Notification(
      obj.area,
      obj.post,
      obj.comments,
    );
  }

  constructor(
    public area: string,
    public post: Post,
    public comments: number[]
  ) { }

  getError(): null {
    return null;
  }
}
