import { Store } from '@ngrx/store';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Route } from '@angular/router';
import { AppStates } from '@store/reducers';
import { Observable } from 'rxjs';
import { Go } from '@store/router-store';
import { isAuthenticated } from '@store/session';

@Injectable()
export class AuthenticateGuard implements CanActivate {
    constructor(private store: Store<AppStates>) { }

    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
        const observable = this.store.select(isAuthenticated);

        observable.subscribe(authenticated => {
            if (!authenticated) {
                this.store.dispatch(new Go({
                    path: ['login']
                }));
            }
        });

        return observable;
    }

    canLoad(route: Route): Observable<boolean> | Promise<boolean> | boolean {
        const observable = this.store.select(isAuthenticated);

        observable.subscribe(authenticated => {
            if (!authenticated) {
                this.store.dispatch(new Go({
                    path: ['login']
                }));
            }
        });

        return observable;
    }
}
