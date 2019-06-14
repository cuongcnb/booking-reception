import { Store, select } from '@ngrx/store';
import { Component, HostBinding, OnInit, OnDestroy } from '@angular/core';
import { AppStates } from '@store/reducers';
import { getSidebarCollapsed, getAppTheme } from '@store/app-core';
import { takeWhile } from 'rxjs/operators';
import { getRouteState } from '@store/router-store';
import * as $ from 'jquery';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {

  @HostBinding('class') cssClass = '';

  private alive = true;

  constructor(
    private store: Store<AppStates>,
  ) {
  }

  ngOnInit() {
    this.store.pipe(
      select(getRouteState),
      takeWhile(() => this.alive)
    ).subscribe(route => {
      if (route && route.state && route.state.url && route.state.url.indexOf('login') >= 0) {
        this.cssClass = 'login';
      } else {
        this.cssClass = '';
      }

      if (route && route.state && route.state.url && route.state.url.indexOf('reception') >= 0) {
        if (!$(':root').hasClass('reception-page')) {
          $(':root').addClass('reception-page');
        }
      } else if ($(':root').hasClass('reception-page')) {
        $(':root').removeClass('reception-page');
      }
    });
  }

  ngOnDestroy(): void {
    this.alive = false;
  }
}
