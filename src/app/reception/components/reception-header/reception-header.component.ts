import { Component, OnInit, OnDestroy, AfterContentInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Session } from 'inspector';
import { localStorageKey } from '../../../../app/app.constants';
import { KvHelper } from '@shared/helpers';
import { Branch } from '@core/models';
import { Store } from '@ngrx/store';
import { AppStates } from '@store/reducers';
import { getSession, LogoutAction } from '@store/session';
import * as $ from 'jquery';

@Component({
    selector: 'reception-header',
    templateUrl: './reception-header.component.html',
    styleUrls: ['./reception-header.component.less']
})
export class ReceptionHeaderComponent implements OnInit, OnDestroy, AfterContentInit {
    public session$: Observable<Session>;
    public receptionView$: Observable<string>;
    public localStorageKey = localStorageKey;
    public changeIdleTimeout$: Subject<number> = new Subject<number>();
    public get managerLink() {
        return `${KvHelper.getHost()}/${KvHelper.getRetailerCode()}/#/Invoices`;
    };
    public get cashierLink() {
        return `${KvHelper.getHost()}/${KvHelper.getRetailerCode()}/pos/#/cashier`;
    }
    public timeNotifySetting: number;
    public showPopupHotkey = false;
    public reservationOfflineNo = 0;
    public currentBranch: Branch;
    private alive = true;

    constructor(
        private store: Store<AppStates>
    ) { }

    ngOnInit() {

    }

    ngAfterContentInit(): void {
        // Code jquery ẩn hiện menu
        $('.list-bar').click(function (e) {
            e.stopPropagation();
            $(this).parent().toggleClass('active');
        });

        $('body').click(function (e) {
            if (e.target.className !== 'list-bar') {
                $('.list-bar').parent().removeClass('active');
            }
            if (!$(e.target).hasClass('scanner-icon')) {
                $('.scanner ul').hide();
            }
        });
    }

    ngOnDestroy(): void {
        this.alive = false;
    }

    public logout() {
        this.store.dispatch(new LogoutAction());
    }
}
