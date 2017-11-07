export class Reset {
  static parse(obj: any) {
    return new Reset();
  }

  getError(): ResetError {
    return null;
  }
}

export class ResetError extends Reset {
  constructor(
    public non_field_errors?: string[],
    public _new_password?: string[],
    public _token?: string[],
    public _transaction?: string[],
    public _captcha?: string[]
  ) { super(); }

  getError(): ResetError {
    return this;
  }
}
