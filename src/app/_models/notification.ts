export class Notification {
  static parse(obj: any) {
    return new Notification(
      obj.area,
      obj.post,
      obj.comment,
      obj.created
    );
  }

  constructor(
    public area: string,
    public post: number,
    public comment: number,
    public created: string
  ) { }

  getError(): null {
    return null;
  }
}
