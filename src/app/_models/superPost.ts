import { Post } from './post';

export class SuperPost {
  static parse(obj: any) {
    return new SuperPost(
      obj.count,
      obj.next,
      obj.previous,
      (() => {
        const posts: Post[] = [];
        obj.results.forEach((post: any) => {
          posts.push(Post.parse(post));
        });
        return posts;
      })()  // Call method
    );
  }

  constructor(
    public count: number,
    public next: string,
    public previous: string,
    public results: Post[]
  ) {
    // Sort posts
    results.sort((a: Post, b: Post) => {
      return new Date(b.created).getTime() - new Date(a.created).getTime();
    });
   }

  getError(): SuperPostError {
    return null;
  }
}

export class SuperPostError extends SuperPost {
  constructor(
    public non_field_errors?: string[],
    public text?: string[]
  ) {
    super(null, null, null, null);
  }

  getError(): SuperPostError {
    return this;
  }
}
