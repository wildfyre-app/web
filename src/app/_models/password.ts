export class Password {
  static parse(obj: any) {
    return new Password();
  }

  getError(): PasswordError {
    return null;
  }
}

export class PasswordError extends Password {
  constructor(
    public non_field_errors?: string[],
    public text?: string[],
    public oldPassword?: string[],
    public newPassword1?: string[],
    public newPassword2?: string[]
  ) { super(); }

  getError(): PasswordError {
    return this;
  }
}
