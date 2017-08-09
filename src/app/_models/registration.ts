export class Registration {
  static parse(obj: any) {
    return new Registration();
  }

  getError(): RegistrationError {
    return null;
  }
}

export class RegistrationError extends Registration {
  constructor(
    public non_field_errors?: string[],
    public _username?: string[],
    public _email?: string[],
    public _password?: string[],
    public _captcha?: string[]
  ) { super(); }

  getError(): RegistrationError {
    return this;
  }
}
