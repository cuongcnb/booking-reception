import { Store } from '@ngrx/store';
import { Injectable, Injector, NgZone } from '@angular/core';
// import '@progress/kendo-ui';
// import '../../node_modules/@progress/kendo-ui/js/cultures/kendo.culture.vi-VN.js';
import { Session } from '@core/models';
import { Router } from '@angular/router';
import { AppStates } from '@store/reducers';
import * as $ from 'jquery';

@Injectable()
export class StartupService {
    private session: Session;

    private get router(): Router {
        return this.injector.get(Router);
    }

    public tabKey: string;
    public isShowRedirectToManagerPopup = false;

    constructor(
        private store: Store<AppStates>,
        private injector: Injector,
        private ngZone: NgZone
    ) { }

    /**
     * Handler on app initital
     */
    public async init(): Promise<void> {

    }
}
