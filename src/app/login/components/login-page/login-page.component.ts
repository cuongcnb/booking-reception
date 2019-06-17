import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs/index';
import { Session } from '@core/models/session.model';
import { ReCaptchaComponent } from 'angular2-recaptcha';
import { Store, select } from '@ngrx/store';
import { AppStates } from '@store/reducers';
import { Router } from '@angular/router';
import { DexieDb } from '@core/database/dexieDbContext';
import { isLoading, getLoginError, showCaptcha, isAuthenticated, doLoginAction } from '@store/session';
import { takeWhile, filter } from 'rxjs/operators';
import { Go } from '@store/router-store';
import { AuthService } from '@core/services';

@Component({
    selector: 'login-page',
    templateUrl: './login-page.component.html',
    styleUrls: ['./login-page.component.css'],
    providers: [
        AuthService
    ]
})
export class LoginPageComponent implements OnInit, OnDestroy {
    @ViewChild(ReCaptchaComponent, { static: true }) captcha: ReCaptchaComponent;

    public loginForm: FormGroup
    public session: Observable<Session>;
    public loading: Observable<boolean>;
    public error: Observable<any>;
    public showCaptcha: Observable<boolean>;

    private alive = true;

    constructor(
        private fb: FormBuilder,
        private store: Store<AppStates>,
        // private pullService: PullService,
        private db: DexieDb,
        private router: Router
    ) {

    }

    ngOnInit() {
        let autoRetailer = '';
        if (window.location && window.location.pathname) {
            const retailerCode = window.location.pathname.match(/\/(.*)\/pos/);
            if (retailerCode) {
                autoRetailer = retailerCode[1];
            }
        }

        // Initial reactive form
        this.loginForm = this.fb.group({
            retailer: autoRetailer,
            username: '',
            password: '',
            rememberMe: true,
            recaptchaResp: ''
        });

        this.loading = this.store.select(isLoading);
        this.error = this.store.select(getLoginError);
        this.showCaptcha = this.store.select(showCaptcha);

        this.store.pipe(
            select(isAuthenticated),
            takeWhile(() => this.alive),
            filter(f => f)
        ).subscribe(value => {
            this.store.dispatch(new Go({
                path: ['reception']
            }));
        });

        // this.store.select(isOnline)
        //     .take(1)
        //     .subscribe(isOnline => {
        //         const failNumber = parseInt(localStorage[localStorageKey.loginFailedNumber]) || 0;
        //         let allowedNumber = environment.AllowedLoginFailNumber || 10;
        //         if (failNumber > allowedNumber - 1 && isOnline) {
        //             this.store.dispatch(new SetShowCaptchaAction({show: true}));
        //         }
        //     });
    }

    ngOnDestroy(): void {
        this.alive = false;
    }

    login() {
        const retailer: string = this.loginForm.get('retailer').value;
        const username: string = this.loginForm.get('username').value;
        const password: string = this.loginForm.get('password').value;
        const rememberMe: boolean = this.loginForm.get('rememberMe').value;
        // const reCaptchaResponse = this.captcha.getResponse();
        // localStorage[localStorageKey.retailer] = (retailer || '').trim();

        this.store.dispatch(doLoginAction({
            retailer: retailer,
            username: username,
            password: password,
            rememberMe: rememberMe,
            // recaptchaResp: reCaptchaResponse
        }));
    }
}
