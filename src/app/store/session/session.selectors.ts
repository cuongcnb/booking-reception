import { Store, createSelector, createFeatureSelector } from '@ngrx/store';
import { AppStates } from '@store/reducers';

export const getSessionState = (state: AppStates) => state.session;

export const isAuthenticated = createSelector(getSessionState, state => state.isAuthenticated);

export const isLoading = createSelector(getSessionState, state => state.loading);

export const getSession = createSelector(getSessionState, state => state.isAuthenticated ? state.session : undefined);

export const getLoginError = createSelector(getSessionState, state => state.error);

export const getBearerToken = createSelector(getSessionState, state => state && state.session ? state.session.BearerToken : '');

export const getCurrentUser = createSelector(getSessionState, state => state && state.session ? state.session.User : null);

export const showCaptcha = createSelector(getSessionState, state => state ? state.showCaptcha : false);
