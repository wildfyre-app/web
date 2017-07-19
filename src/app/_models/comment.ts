import { Injectable } from '@angular/core';
import {Author} from './index';

@Injectable()
export class Comment {
  constructor(
    public id: number,
    public author: Author,
    public created: string,
    public text: string
  ) { }
}
