import { select, Store } from '@ngrx/store';
import { Session } from './../models/session.model';
import { Auth } from './../models/auth.model';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import * as R from 'ramda';
import { AppStates } from '@store/reducers';
import { Observable, of } from 'rxjs';
import { localStorageKey } from '../../app.constants';
import { SetSessionAction } from '@store/session/session.actions';
import { getSession } from '@store/session/session.selectors';
import { KvHelper, SHA256Helper } from '@shared/helpers';

@Injectable()
export class AuthService {
    static SEPARATOR_CHAR = '|';
    private baseApiUrl = `${KvHelper.getHost()}/api/`;
    public session: Session;

    private get subDomainUrl() {
        return `${KvHelper.getHost()}`;
    }

    constructor(private http: HttpClient,
        private store: Store<AppStates>) {
        if (localStorage[localStorageKey.session]) {
            this.store.dispatch(new SetSessionAction(JSON.parse(localStorage[localStorageKey.session])));
        }

        this.store.pipe(
            select(getSession)
        )
            .subscribe(session => {
                this.session = session;
                this.saveSession(session);
            });
    }

    public credentials(retailer: string, username: string, password: string, rememberMe: boolean, recaptchaResp?: string): Observable<Auth> {
        // return this.http.post(`${this.subDomainUrl}/api/auth/salelogin`, {
        //         provider: 'credentials',
        //         Retailer: retailer,
        //         UserName: username,
        //         Password: password,
        //         RememberMe: rememberMe,
        //         UseTokenCookie : true,
        //         RecaptchaResponse: recaptchaResp
        //     }, {
        //         withCredentials: true
        //     })
        //     .map(resp => <Auth>resp.json())
        //     .catch(this.handleError);
        return of({} as any);
    }

    /**
     * Authenticate when network state offline
     * @param: {username} string
     * @param: {password} string
     */
    public authenOffline = (retailer: string, username: string, password: string): Observable<Session> => {
        // return new Observable<Session>((obs) => {
        //     this.cacheService.getByKey(this.getOfflineHashString(username, password))
        //         .then(cache => {
        //             let sessionOffline = cache ? JSON.parse(cache.Value) : null;
        //
        //             if (sessionOffline) {
        //                 obs.next(sessionOffline);
        //             } else {
        //                 obs.error(this.translateService.instant('Tài khoản mật khẩu không chính xác hoặc tài khoản này chưa từng đăng nhập trên thiết bị này.'));
        //             }
        //         })
        //         .catch(err => {
        //             obs.error(this.translateService.instant('Tài khoản mật khẩu không chính xác hoặc tài khoản này chưa từng đăng nhập trên thiết bị này.'));
        //         });
        // });
        return of(null);
    }

    /**
     * Get full info current session for sessionData
     * @param: {sessionData} session not fully info
     */
    public getCurrentSessionInfo(): Observable<any> {
        // return this.http.get(`${this.baseApiUrl}retailers/currentsession`)
        //         .map(resp => <any>resp.json())
        //         .catch(this.handleError);
        return of({
            BearerToken: 'xxx'
        });
    }

    public saveSession(session: Session): void {
        if (session) {
            localStorage[localStorageKey.session] = JSON.stringify(session);
        } else {
            localStorage.removeItem(localStorageKey.session);
        }
    }

    private handleError(error: Response) {
        return Observable.throw(error.status === 0 ? 'Network error' : (error.json() as any) || 'Server error');
    }

    public has(role: string): boolean {
        if (!this.session) {
            return false;
        }

        if (this.session.User.IsAdmin) {
            return true;
        } else {
            return this.session.Privileges[role] || false;
        }
    }

    public inverseHas(role: string): boolean {
        if (!this.session) {
            return false;
        }

        if (this.session.User.IsAdmin) {
            return false;
        } else {
            return this.session.Privileges[role] || false;
        }
    }

    /**
     * Handler on logout event
     * @param: {sessionData} Session
     */
    public onLogoutSuccessed(): void {
        // remove session
        localStorage.removeItem(localStorageKey.session);
        // remove firebase token
    }

    public logout() {
        // return this.http.post(`${this.subDomainUrl}/api/auth/logout`, null, { withCredentials: true }).map(resp => resp.json());
        return of(1);
    }

    /**
     * @desc: Get error message from response error login
     * @param err Error response
     */
    public getFailedLoginError(err) {
        let errors = [];

        if (typeof err === 'string') {
            errors = [err];
        } else {
            if (err && err.ResponseStatus) {
                let errorData: any[] = err.ResponseStatus.Errors;
                if (errorData && errorData.length > 0) {
                    let getMsg = e => e.Message;

                    errors = R.map(getMsg, errorData);

                } else {
                    if (err.ResponseStatus.Message === 'Invalid UserName or Password') {
                        err.ResponseStatus.Message = gettext('Sai Tên đăng nhập hoặc mật khẩu!.');
                    }
                    errors = [err.ResponseStatus.Message];
                }
            }
        }

        return errors;
    }

    /**
     * Get offline hash string
     * @param: {username} string
     * @param: {password} string
     */
    private getOfflineHashString = (username: string, password: string): string => {
        let hashHelper = new SHA256Helper();
        // toLowerCase() for username because system can accept any case with username
        return `offline_ss_${username}_${hashHelper.hash(`${username.toLowerCase()}${AuthService.SEPARATOR_CHAR}${password}`)}`;
    }

    /**
     * Save for offline login
     * @param: {sessionData} Session data
     * @param: {password} Password login
     */
    public saveForOfflineAuth = async (sessionData: Session, username: string, password: string) => {
        // await this.removeOldSessionByUser(username);
        //
        // await this.cacheService.addOrUpdateCacheAsync({
        //     Key: this.getOfflineHashString(username, password),
        //     Value: JSON.stringify(sessionData),
        //     Expire: DateHelpers.addDays(new Date(), 28) // expire after 28 days
        // });
    }

    /**
     * @description Remove all old session by username
     * @param username
     */
    private async removeOldSessionByUser(username: string) {
        // const oldKeys = await this.cacheService.getAllBy('Key').startsWith(`offline_ss_${username}`).toArray();
        //
        // if (oldKeys && oldKeys.length > 0) {
        //     await this.cacheService.batchDelete(oldKeys.map(c => c.Key));
        // }
    }

    /**
     * Get seession from session info object
     * @param session
     * @param sessionInfo
     */
    public sessionInfoToSession(session: Session, sessionInfo: any) {
        if (!sessionInfo) {
            return session;
        }

        let sessionData = session
        sessionData.Retailer = sessionInfo.Retailer;
        sessionData.CurrentBranch = sessionInfo.CurrentBranch;
        sessionData.User = sessionInfo.CurrentUser;
        sessionData.Privileges = sessionInfo.Privileges;
        sessionData.Branches = sessionInfo.Branches;
        sessionData.Setting = sessionInfo.Setting;
        sessionData.IsTrackToLogRocket = sessionInfo.IsTrackToLogRocket;
        return sessionData;
    }
}
