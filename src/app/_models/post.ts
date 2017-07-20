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
}
