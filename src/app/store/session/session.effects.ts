import { Store, Action } from '@ngrx/store';
import { AppStates } from '@store/reducers';
import { Injectable } from '@angular/core';
import { Effect, Actions, ofType, createEffect } from '@ngrx/effects';
import { Observable, of, empty } from 'rxjs';
import { doLoginAction, loginSuccessAction, getSessionInfoAction, loginFailedAction, logoutAction, logoutSuccessedAction } from './session.actions';
import { toPayload } from '@utils/data.utils';
import { map, switchMap, tap, catchError, mergeMap } from 'rxjs/operators';
import { StringHelpers } from '@shared/helpers';
import { AuthService } from '@core/services';
import { Session } from '@core/models';

@Injectable()
export class SessionEffects {

    public doLogin$ = createEffect(() => this.actions$.pipe(
        ofType(doLoginAction),
        // map(toPayload),
        switchMap((payload: any) => {
            const retailer = payload.retailer;
            const username = payload.username;
            const password = payload.password;
            const rememberMe = payload.rememberMe;

            if (StringHelpers.isNullOrEmpty(username)) {
                return of(loginFailedAction({error: gettext('Bạn chưa nhập tên đăng nhập')}));
            }
            if (StringHelpers.isNullOrEmpty(password)) {
                return of(loginFailedAction({error: gettext('Bạn chưa nhập mật khẩu')}));
            }
            return this.authService.credentials(retailer, username, password, rememberMe, payload.recaptchaResp)
                .pipe(
                    map(authMeta => loginSuccessAction({ authMeta: authMeta, username: username, password: password })),
                    catchError(() => of(loginFailedAction(null)))
                )
        })
    ))

    public loginSuccessed$ = createEffect(() =>
        this.actions$.pipe(
            ofType(loginSuccessAction),
            switchMap(payload => this.authService.getCurrentSessionInfo().pipe(
                map((sessionInfo) => {
                    return {
                        sessionInfo: sessionInfo,
                        username: payload.username,
                        password: payload.password
                    }
                })
            )),
            // switchMap(({ sessionInfo, username, password }) => {
            //     return this.authService.saveForOfflineAuth({
            //         BearerToken: sessionInfo.BearerToken,
            //         CurrentBranchId: sessionInfo.CurrentBranch ? sessionInfo.CurrentBranch : sessionInfo.CurrentBranchId,
            //         UserId: sessionInfo.CurrentUser.Id.toString(),
            //         User: sessionInfo.CurrentUser,
            //         Setting: sessionInfo.Setting,
            //         Retailer: sessionInfo.Retailer,
            //         CurrentBranch: sessionInfo.CurrentBranch,
            //         Branches: sessionInfo.Branches,
            //         Privileges: sessionInfo.Privileges,
            //         HasKvPrinterSession: sessionInfo.HasKvPrinterSession,
            //         IsTrackToLogRocket: sessionInfo.IsTrackToLogRocket
            //     } as Session, username, password)
            // }, ({ sessionInfo, username, password }) => {
            //     return { sessionInfo, username, password };
            // }),
            switchMap(({ sessionInfo, username, password }) => {
                return of(getSessionInfoAction({ sessionInfo: sessionInfo, username: username, password: password }));
            }),
            // catchError(err => of(loginFailedAction({error: this.authService.getFailedLoginError(err) || ['Server error']})))
        ));

    public logout$ = createEffect(() =>
        this.actions$.pipe(
            ofType(logoutAction),
            switchMap(() => {
                return this.authService.logout().pipe(
                    map(() => logoutSuccessedAction())
                )
            })
        ));

    public logoutSuccessed$ = createEffect(() =>
        this.actions$.pipe(
            ofType(logoutSuccessedAction),
            tap(() => this.authService.onLogoutSuccessed()),
            tap(() => window.location.reload()),
            switchMap(() => {
                return empty();
            })
        ));

    constructor(
        public actions$: Actions,
        public store: Store<AppStates>,
        private authService: AuthService
    ) { }
}
