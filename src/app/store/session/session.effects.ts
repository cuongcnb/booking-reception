import { Store, Action } from '@ngrx/store';
import { AppStates } from '@store/reducers';
import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Observable, of, empty } from 'rxjs';
import { sessionActionTypes, LoginFailedAction, LoginSuccessedAction, SetSessionAction, GetSessionInfoAction, LogoutSuccessedAction } from './session.actions';
import { toPayload } from '@utils/data.utils';
import { map, switchMap, tap } from 'rxjs/operators';
import { StringHelpers } from '@shared/helpers';
import { AuthService } from '@core/services';
import { Session } from '@core/models';

@Injectable()
export class SessionEffects {

    @Effect()
    public doLogin$: Observable<Action> = this.actions$.pipe(
        ofType(sessionActionTypes.DO_LOGIN),
        map(toPayload),
        switchMap(payload => {
            const retailer = payload.retailer;
            const username = payload.username;
            const password = payload.password;
            const rememberMe = payload.rememberMe;

            // if (StringHelpers.isNullOrEmpty(retailer)) {
            //     return of(new LoginFailedAction(['Bạn chưa nhập tên gian hàng']));
            // }
            // if (StringHelpers.isNullOrEmpty(username)) {
            //     return of(new LoginFailedAction(['Bạn chưa nhập tên đăng nhập']));
            // }
            // if (StringHelpers.isNullOrEmpty(password)) {
            //     return of(new LoginFailedAction(['Bạn chưa nhập mật khẩu']));
            // }
            return this.authService.credentials(retailer, username, password, rememberMe, payload.recaptchaResp)
                .pipe(map(authMeta => new LoginSuccessedAction({ authMeta: authMeta, username: username, password: password })))
                // .catch(err => {
                //     console.log(err);
                //     return new Observable<SetSessionAction | LoginFailedAction>(obs => {
                //         this.store
                //         .select(isOnline)
                //         .take(1)
                //         .subscribe(online => {
                //             if (!online || err === 'Network error') {
                //                 return this.authService.authenOffline(payload.retailer, payload.username, payload.password)
                //                     .subscribe(
                //                         session => obs.next(new SetSessionAction(session)),
                //                         error => obs.next(new LoginFailedAction(this.authService.getFailedLoginError(error) || ['Server error']))
                //                     );
                //             } else {
                //                 return obs.next(new LoginFailedAction(this.authService.getFailedLoginError(err) || ['Server error']));
                //             }
                //         });
                //     });
                // });
        })
    );

    @Effect()
    public loginSuccessed: Observable<Action> = this.actions$.pipe(
        ofType(sessionActionTypes.LOGIN_SUCCESSED),
        map(toPayload),
        switchMap(payload => this.authService.getCurrentSessionInfo(), (payload, sessionInfo) => {
            return {
                sessionInfo: sessionInfo,
                username: payload.username,
                password: payload.password
            };
        }),
        switchMap(({sessionInfo, username, password}) => {
            return this.authService.saveForOfflineAuth({
                BearerToken: sessionInfo.BearerToken,
                // CurrentBranchId: sessionInfo.CurrentBranch ? sessionInfo.CurrentBranch : sessionInfo.CurrentBranchId,
                // UserId: sessionInfo.CurrentUser.Id.toString(),
                // User: sessionInfo.CurrentUser,
                // Setting: sessionInfo.Setting,
                // Retailer: sessionInfo.Retailer,
                // CurrentBranch: sessionInfo.CurrentBranch,
                // Branches: sessionInfo.Branches,
                // Privileges: sessionInfo.Privileges,
                // HasKvPrinterSession: sessionInfo.HasKvPrinterSession,
                // IsTrackToLogRocket: sessionInfo.IsTrackToLogRocket
            } as Session, username, password)
        }, ({sessionInfo, username, password}) => {
            return {sessionInfo, username, password};
        }),
        switchMap(({sessionInfo, username, password}) => {
            return of(new GetSessionInfoAction({ sessionInfo: sessionInfo, username: username, password: password }));
        })
    )
    // catch(err => of(new LoginFailedAction(this.authService.getFailedLoginError(err) || ['Server error'])));

    @Effect()
    public logout$: Observable<Action> = this.actions$.pipe(
        ofType(sessionActionTypes.LOGOUT),
        switchMap(() => {
            return this.authService.logout().pipe(
                map(() => new LogoutSuccessedAction())
            )
        })
    );

    @Effect()
    public logoutSuccessed$: Observable<Action> = this.actions$.pipe(
        ofType(sessionActionTypes.LOGOUT_SUCCESSED),
        tap(() => this.authService.onLogoutSuccessed()),
        tap(() => window.location.reload()),
        switchMap(() => {
            return empty();
        })
    );

    constructor(
        public actions$: Actions,
        public store: Store<AppStates>,
        private authService: AuthService
    ) {}
}
