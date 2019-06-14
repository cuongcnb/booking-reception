import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, ErrorHandler, APP_INITIALIZER } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HttpClientJsonpModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { APP_CORE_MODULES } from './core/components';
import { AppRoutingModule } from './app.routes';

import { AppComponent } from './app.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { AppErrorHandler } from './core/services/error-handler';
import { CoreModule } from '@core/core.module';
import { SharedModule } from '@shared/shared.module';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { AppTranslateLoader } from '@core/common/app-translate-loader';
import { StartupService } from './startup.service';

export function startupServiceFactory(startupService: StartupService): Function {
  return () => startupService.init();
}

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    HttpClientJsonpModule,
    BrowserAnimationsModule,

    /* Routing Modular */
    AppRoutingModule,

    CoreModule,
    SharedModule,
    ...APP_CORE_MODULES,

    ServiceWorkerModule.register('/ngsw-worker.js', {
      enabled: environment.production
    }),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useClass: AppTranslateLoader,
      }
    })
  ],
  providers: [
    StartupService,
    { provide: ErrorHandler, useClass: AppErrorHandler },
    {
      provide: APP_INITIALIZER,
      useFactory: startupServiceFactory,
      deps: [StartupService],
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
