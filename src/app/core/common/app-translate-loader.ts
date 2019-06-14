import { TranslateLoader } from '@ngx-translate/core';
import { Observable, of } from 'rxjs';

export class AppTranslateLoader implements TranslateLoader {
  getTranslation(lang: string): Observable<any> {
    // return Observable.fromPromise(System.import(`../../assets/i18n/locale/en-US.json`));
    return of({});
  }
}
