export class SetUser {
  static readonly type = "[LoginState] setUsername";
  constructor(public userName: string) {}
}
