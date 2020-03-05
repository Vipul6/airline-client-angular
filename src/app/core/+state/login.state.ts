import { State, Selector, Action, StateContext } from "@ngxs/store";
import { SetUser } from "./login.action";
import { LoginStateModel } from "./login.model";
import { Injectable } from "@angular/core";

const defaultState: LoginStateModel = {
  userName: null
};

@State<LoginStateModel>({
  name: "LoginState",
  defaults: defaultState
})
@Injectable()
export class LoginState {
  constructor() {}

  @Selector()
  static GetUser(state: LoginStateModel): string {
    return state.userName;
  }

  @Action(SetUser)
  SetUser(
    { patchState }: StateContext<LoginStateModel>,
    { userName }: SetUser
  ): void {
    patchState({
      userName
    });
  }
}
