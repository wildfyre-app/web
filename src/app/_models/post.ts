import { Author } from './author';
import { Comment } from './comment';
import { Image } from './image';

export class Post {
  public created: Date;

  static parse(obj: any) {
    return new Post(
      obj.id,
      (() => {
        if (obj.author === null) {
          return  new Author(498, 'Anonymous', 'https://upload.wildfyre.net/api/avatar/ic_visibility_off_black_24dp.png', null, false);
        }
        return Author.parse(obj.author);
      })(), // Call method
      obj.anonym,
      obj.subscribed,
      obj.created,
      obj.active,
      obj.text,
      (() => {
        if (obj.image === null) {
          return '';
        }
        return obj.image;
      })(), // Call method
      (() => {
        const additional_images: Image[] = [];
        obj.additional_images.forEach((additional_image: any) => {
          additional_images.push(Image.parse(additional_image));
        });
        return additional_images;
      })(),
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
    public anonym: boolean,
    public subscribed: boolean,
    created: string,
    public active: boolean,
    public text: string,
    public image: string,
    public additional_images: Image[],
    public comments: Comment[]
  ) {
    this.created = new Date(created);
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
    super(null, null, null, null, null, null, null, null, [], []);
  }

  getError(): PostError {
    return this;
  }
}
