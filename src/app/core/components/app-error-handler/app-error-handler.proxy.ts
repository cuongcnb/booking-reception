import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { AppApi } from '@api/app.api';
import { AppStates } from '@store/reducers';
import { ToggleError, selectErrorMessage, selectIsErrorShow, selectErrorAction, CleanError } from '@store/app-core';

@Injectable()
export class AppErrorHandlerProxy {
  errorMessage$ = this.store.pipe(select(selectErrorMessage));
  isShowError$ = this.store.pipe(select(selectIsErrorShow));
  errorAction$ = this.store.pipe(select(selectErrorAction));

  constructor(private store: Store<AppStates>, private appApi: AppApi) {}

  toggleError() {
    this.store.dispatch(new ToggleError());
  }

  cleanError() {
    this.store.dispatch(new CleanError());
  }
}
