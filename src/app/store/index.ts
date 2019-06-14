import { NgModule } from '@angular/core';
import { Store, StoreModule, ActionReducer, MetaReducer } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { localStorageSync } from 'ngrx-store-localstorage';
// import { StoreRouterConnectingModule, RouterStateSerializer } from '@ngrx/router-store';

import { environment } from '@env/environment';
import { AppStates, reducers } from './reducers';
import { AppCoreEffects } from './app-core/app-core.effects';
import { EffectsModule } from '@ngrx/effects';
import { SessionEffects } from './session';
import { RouterEffects, NavigationSerializer } from './router-store';
import { StoreRouterConnectingModule, RouterStateSerializer } from '@ngrx/router-store';

// import { storeFreeze } from 'ngrx-store-freeze';

export function localStorageSyncReducer(
  reducer: ActionReducer<any>
): ActionReducer<any> {
  return localStorageSync({
    keys: Object.keys(reducers),
    rehydrate: true
  })(reducer);
}
const metaReducers: MetaReducer<any, any>[] = [localStorageSyncReducer];
const optionalImports = [];
if (!environment.production) {
  // Note that you must instrument after importing StoreModule
  optionalImports.push(StoreDevtoolsModule.instrument({ maxAge: 25 } as any));
}

@NgModule({
  imports: [
    StoreModule.forRoot(reducers, {
      metaReducers
    }),
    EffectsModule.forRoot([
      AppCoreEffects,
      RouterEffects,
      SessionEffects
    ]),
    StoreRouterConnectingModule.forRoot(),
    ...optionalImports
  ],
  declarations: [],
  exports: [],
  providers: [
    { provide: RouterStateSerializer, useClass: NavigationSerializer }
  ]
})
export class CoreStoreModule { }
