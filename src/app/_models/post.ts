import { Author } from './author';
import { Comment } from './comment';
import { Image } from './image';

export class Post {
  static parse(obj: any) {
    return new Post(
      obj.id,
      (() => {
        if (obj.author === null) {
          return  new Author(498, 'Anonymous', 'https://static.wildfyre.net/anonym.svg', null, false);
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
    public created: string,
    public active: boolean,
    public text: string,
    public image: string,
    public additional_images: Image[],
    public comments: Comment[]
  ) {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    const time = new Date(created);
    this.created = time.toLocaleDateString(undefined, options);
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
