import {Author} from './index';

export class Comment {
  constructor(
    public id: number,
    public author: Author,
    public created: string,
    public text: string
  ) { }
}
