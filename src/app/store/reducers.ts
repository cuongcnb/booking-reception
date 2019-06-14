import { RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { ActionReducerMap, Store } from '@ngrx/store';

// reducers
import { appCoreReducer } from './app-core';
import { sessionReducer } from './session/session.reducer';
import { SessionState } from './session';
import { AppCoreState } from './app-core/app-core.state';
import { routerReducer, RouterReducerState } from '@ngrx/router-store';

// The top level Echoes Player application interface
// each reducer is reponsible for manipulating a certain state
export interface AppStates {
  router: RouterReducerState;
  appCore: AppCoreState;
  session: SessionState;
}

export let reducers: ActionReducerMap<AppStates> = {
  router: routerReducer,
  appCore: appCoreReducer,
  session: sessionReducer
};
