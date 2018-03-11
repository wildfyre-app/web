import { Author } from './author';

export class NotificationPost {
  static parse(obj: any) {
    return new NotificationPost(
      obj.id,
      (() => {
        if (obj.author === null) {
          return  new Author(498, 'Anonymous', 'https://upload.wildfyre.net/api/avatar/ic_visibility_off_black_24dp.png', null, false);
        }
        return Author.parse(obj.author);
      })(), // Call method
      obj.text
    );
  }

  constructor(
    public id: number,
    public author: Author,
    public text: string
  ) { }

  getError(): null {
    return null;
  }
}
