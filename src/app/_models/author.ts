import { Injectable } from '@angular/core';

@Injectable()
export class Author {
  constructor(
    public user: number,
    public name: string,
    public avatar: string,
    public bio: string,
    public banned: boolean
  ) { }
}
