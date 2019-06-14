import { NgModule, Optional, SkipSelf, ErrorHandler } from '@angular/core';

import { APP_SERVICES } from './services';
import { APP_APIS } from './api';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppHttpInterceptor } from './services/app-http-interceptor';
import { CoreStoreModule } from '../store';
import { AuthenticateGuard } from './common/authenticate.guard';
import { DexieDb } from './database/dexieDbContext';

@NgModule({
  imports: [CoreStoreModule],
  declarations: [],
  exports: [CoreStoreModule],
  providers: [
    ...APP_SERVICES,
    ...APP_APIS,
    DexieDb,
    AuthenticateGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AppHttpInterceptor,
      multi: true
    }
  ]
})
export class CoreModule {
}
