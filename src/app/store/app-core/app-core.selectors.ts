import { createSelector } from '@ngrx/store';
import { AppStates } from '@store/reducers';
import { AppCoreState, IAppError } from './app-core.state';

export const getAppCore = (state: AppStates) => state.appCore;
export const getAppTheme = createSelector(
  getAppCore,
  (state: AppCoreState) => state.theme
);
export const getAllAppThemes = createSelector(
  getAppCore,
  (state: AppCoreState) => state.themes
);
export const getAppThemes = createSelector(
  getAppCore,
  getAppTheme,
  getAllAppThemes,
  (appLayout, theme: string, themes: string[]) => ({
    selected: theme,
    themes: themes.map(_theme => ({ label: _theme, value: _theme }))
  })
);
export const getAppVersion = createSelector(
  getAppCore,
  (state: AppCoreState) => state.version
);
export const getSidebarCollapsed = createSelector(
  getAppCore,
  (state: AppCoreState) => !state.sidebarExpanded
);
export const selectError = createSelector(
  getAppCore,
  (state: AppCoreState) => state.error
);
export const selectErrorMessage = createSelector(
  selectError,
  (error: IAppError) => error.message
);
export const selectIsErrorShow = createSelector(
  selectError,
  (error: IAppError) => error.show
);
export const selectErrorAction = createSelector(
  selectError,
  (error: IAppError) => error.action
);
