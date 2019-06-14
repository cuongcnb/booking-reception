import { ErrorHandler, Injectable, Injector } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { AppApi } from '@core/api/app.api';

const HandledErrors = ['HttpErrorResponse'];
const DimissedErrors = ['popup_closed_by_user'];
const isYoutubeApiError = error =>
  error && error.error && error.error.error.errors;

@Injectable({
  providedIn: 'root'
})
export class AppErrorHandler implements ErrorHandler {
  constructor(private injector: Injector) {}

  handleError(error: Error | HttpErrorResponse | any) {
    const appApi = this.injector.get(AppApi);
    if (!DimissedErrors.includes(error.name)) {
      console.log('There was an ERROR:', error);
      appApi.notifyError(error);
    }
  }
}
