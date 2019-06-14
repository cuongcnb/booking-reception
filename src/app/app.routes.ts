import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

export const ROUTES: Routes = [
  { path: '', redirectTo: 'reception', pathMatch: 'full' },
  { path: 'login', loadChildren: 'app/login/login.module#LoginModule' },
  {
    path: 'reception',
    loadChildren: 'app/reception/reception.module#ReceptionModule'
  },
  {
    path: '**',
    redirectTo: '/reception'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(ROUTES, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
