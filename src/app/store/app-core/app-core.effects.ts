import { Store } from '@ngrx/store';
import { AppStates } from '@store/reducers';
import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';

import { map } from 'rxjs/operators';

import * as fromAppCore from '@store/app-core';

@Injectable()
export class AppCoreEffects {

  constructor(
    public actions$: Actions,
    public store: Store<AppStates>
  ) {}
}
