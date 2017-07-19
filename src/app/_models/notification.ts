import { Injectable } from '@angular/core';

@Injectable()
export class Notification {
  constructor(
    public area: string,
    public post: number,
    public comment: number,
    public created: string
  ) { }
}
