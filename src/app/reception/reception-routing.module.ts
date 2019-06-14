import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReceptionPageComponent } from './components/reception-page/reception-page.component';
import { AuthenticateGuard } from '@core/common/authenticate.guard';

const routes: Routes = [
    {
        path: '',
        component: ReceptionPageComponent,
        canActivate: [AuthenticateGuard],
        canLoad: [AuthenticateGuard]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ReceptionRoutingModule { }
