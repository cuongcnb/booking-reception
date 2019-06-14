import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from '@core/services';
import { Store } from '@ngrx/store';
import { AppStates } from '@store/reducers';

@Component({
    selector: 'reception-page',
    templateUrl: './reception-page.component.html',
    styleUrls: ['./reception-page.component.less']
})
export class ReceptionPageComponent implements OnInit, OnDestroy {
    // public calendarStartTime: Date;
    // public calendarEndTime: Date;
    // public receptionViews = receptionViews;
    // public filterSetting = filterSettingForReception;
    // public defaultFilter = defaultListFilterForReception;
    // public openReservationForm$: Subject<void> = new Subject<void>();
    // public exportReservation$: Subject<any> = new Subject<any>();
    // public printMutilReservation$: Subject<void> = new Subject<void>();
    // public tableAndRoomResource: TableAndRoomResource[];
    // public receptionView: string;
    // public showManipulation: boolean;
    // public exportReservationFile: ImportExportModel[];
    // public reservationSelectedIds: number[];

    constructor(
        public authService: AuthService,
        private store: Store<AppStates>
    ) { }

    ngOnInit() {

    }

    ngOnDestroy() {
    }
}
