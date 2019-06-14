import { Store } from '@ngrx/store';
import { Injectable } from '@angular/core';

// Actions
import * as AppCore from '@store/app-core';
import * as RouterActions from '@store/router-store';
import { AppStates } from '@store/reducers';

@Injectable()
export class AppApi {
  themes$ = this.store.select(AppCore.getAppThemes);
  appVersion$ = this.store.select(AppCore.getAppVersion);

  constructor(private store: Store<AppStates>) {}

  toggleSidebar() {
    this.store.dispatch(new AppCore.ToggleSidebar());
  }

  navigateBack() {
    this.store.dispatch(new RouterActions.Back());
  }

  updateVersion() {
    this.store.dispatch(new AppCore.UpdateAppVersion());
  }

  checkVersion() {
    this.store.dispatch(new AppCore.CheckVersion());
  }

  changeTheme(theme: string) {
    this.store.dispatch(new AppCore.ThemeChange(theme));
  }

  notifyNewVersion(response) {
    this.store.dispatch(new AppCore.RecievedAppVersion(response));
  }

  recievedNewVersion(response) {
    this.store.dispatch(new AppCore.RecievedAppVersion(response));
  }

  notifyError(error) {
    this.store.dispatch(new AppCore.AddError(error));
  }
}
