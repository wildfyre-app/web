export class AreaList {
  constructor(
    public name: string,
    public rep: number,
    public spread: number
  ) { }

  getDisplayName(): string {
    return this.name.charAt(0).toUpperCase() + this.name.slice(1);
  }

  getError(): null {
    return null;
  }
}
