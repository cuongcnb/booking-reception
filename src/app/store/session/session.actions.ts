import { Action, createAction, props, union } from '@ngrx/store';
import { Auth } from '@core/models';
import { type } from '@store/store.utils';

export const doLoginAction = createAction(
    '[Session] Do Login',
    props<{ retailer: string, username: string, password: string, rememberMe: boolean, recaptchaResp?: string }>()
);

export const loginSuccessAction = createAction(
    '[Session] Login Successed',
    props<{ authMeta: Auth, username: string, password: string }>()
);

export const loginFailedAction = createAction(
    '[Session] Login Failed',
    props<{error: any}>()
);

export const getSessionInfoAction = createAction(
    '[Session] Get Session Info',
    props<{ sessionInfo: any, username: string, password: string }>()
);

export const logoutAction = createAction(
    '[Session] Logout'
);

export const logoutSuccessedAction = createAction(
    '[Session] Logout successed'
);

export const setSessionAction = createAction(
    '[Session] Save Session',
    props<{ session: any }>()
);

export const setShowCaptchaAction = createAction(
    '[Session] Set show captcha',
    props<{ show: boolean }>()
);

export const setRealTimeTokenAction = createAction(
    '[Session] Set real time token',
    props<{ payload: any }>()
);


const all = union({
    doLoginAction,
    loginSuccessAction,
    loginFailedAction,
    getSessionInfoAction,
    logoutAction,
    logoutSuccessedAction,
    setSessionAction,
    setShowCaptchaAction,
    setRealTimeTokenAction
  });
  export type SessionActionsUnion = typeof all;
