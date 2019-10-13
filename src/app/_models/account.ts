export class Account {
  static parse(obj: any) {
    return new Account(
      obj.id,
      obj.username,
      (() => {
        if (obj.email === '') {
          return '*Please verify your email*';
        }
        return obj.email;
      })(), // Call method
    );
  }

  constructor(
    public id: number,
    public username: string,
    public email: string
  ) { }

  getError(): AccountError {
    return null;
  }
}

export class AccountError extends Account {
  constructor(
    public non_field_errors?: string[],
    public text?: string[]
  ) {
    super(null, null, null);
  }

  getError(): AccountError {
    return this;
  }
}
