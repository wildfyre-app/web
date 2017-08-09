export class Area {
  static parse(obj: any) {
    return new Area(
      obj.name
    );
  }

  constructor(
    public name: string
  ) { }

  getError(): null {
    return null;
  }
}
