import { Action } from '@ngrx/store';
import { Auth } from '@core/models';
import { type } from '@store/store.utils';

export const sessionActionTypes = {
    DO_LOGIN: type('[Session] Do Login'),
    LOGIN_SUCCESSED: type('[Session] Login Successed'),
    LOGIN_FAILED: type('[Session] Login Failed'),
    GET_SESSION_INFO: type('[Session] Get Session Info'),
    LOGOUT: type('[Session] Logout'),
    LOGOUT_SUCCESSED: type('[Session] Logout successed'),
    SET_SESSION: type('[Session] Save Session'),
    SET_SHOW_CAPTCHA: type('[Session] Set show captcha'),
    SET_REAL_TIME_TOKEN: type('[Session] Set real time token')
}

export class DoLoginAction implements Action {
    readonly type = sessionActionTypes.DO_LOGIN;
    constructor (public payload: { retailer: string, username: string, password: string, rememberMe: boolean, recaptchaResp?: String }) { }
}

export class LoginSuccessedAction implements Action {
    readonly type = sessionActionTypes.LOGIN_SUCCESSED;
    constructor (public payload: { authMeta: Auth, username: string, password: string }) { }
}

export class LoginFailedAction implements Action {
    readonly type = sessionActionTypes.LOGIN_FAILED;
    constructor (public payload?: any) { }
}

export class GetSessionInfoAction implements Action {
    readonly type = sessionActionTypes.GET_SESSION_INFO;
    constructor(public payload: { sessionInfo: any, username: string, password: string }) { }
}

export class LogoutAction implements Action {
    readonly type = sessionActionTypes.LOGOUT;
    constructor (public payload?: any) { }
}

export class LogoutSuccessedAction implements Action {
    readonly type = sessionActionTypes.LOGOUT_SUCCESSED;
    constructor (public payload?: any) { }
}

export class SetSessionAction implements Action {
    readonly type = sessionActionTypes.SET_SESSION;
    constructor (public payload) { }
}

export class SetShowCaptchaAction implements Action {
    readonly type = sessionActionTypes.SET_SHOW_CAPTCHA;
    constructor (public payload: boolean) { }
}

export class SetRealTimeTokenAction implements Action {
    readonly type = sessionActionTypes.SET_REAL_TIME_TOKEN;
    constructor (public payload: string) { }
}
export type SessionActions
    =
    DoLoginAction
    | LoginSuccessedAction
    | LoginFailedAction
    | GetSessionInfoAction
    | LogoutAction
    | LogoutSuccessedAction
    | SetSessionAction
    | SetShowCaptchaAction
    | SetRealTimeTokenAction;

