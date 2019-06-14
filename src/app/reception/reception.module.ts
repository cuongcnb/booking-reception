import { TranslateModule } from '@ngx-translate/core';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ReceptionRoutingModule } from './reception-routing.module';
import { ReceptionPageComponent } from './components/reception-page/reception-page.component';
import { ReceptionHeaderComponent } from './components/reception-header/reception-header.component';

@NgModule({
    imports: [
        CommonModule,
        ReceptionRoutingModule,
        ReactiveFormsModule,
        TranslateModule
    ],
    declarations: [
        ReceptionPageComponent,
        ReceptionHeaderComponent
    ]
})
export class ReceptionModule { }
