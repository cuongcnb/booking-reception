export enum ErrorActions {
  RELOAD = 'Reload',
  NONE = 0,
  RESET = 1
}
export enum ErrorMessages {
  OFFLINE = 'No Connection Available',
  RESPONSE_ERROR = 'Error With Providing Response'
}
export interface IAppVersion {
  semver: string;
  isNewAvailable: boolean;
  checkingForVersion: boolean;
}
export interface IAppError {
  message: string;
  show: boolean;
  action: ErrorActions;
}
export interface AppCoreState {
  sidebarExpanded: boolean;
  requestInProcess: boolean;
  version: IAppVersion;
  theme: string;
  themes: string[];
  error: IAppError;
}
