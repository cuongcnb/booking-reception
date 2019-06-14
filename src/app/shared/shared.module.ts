import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { SHARED_COMPONENTS } from './components';
import { SHARED_DIRECTIVES } from './directives';
import { PIPES } from './pipes';
import { DragDropModule } from '@angular/cdk/drag-drop';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    InfiniteScrollModule,
    DragDropModule
  ],
  declarations: [...SHARED_COMPONENTS, ...SHARED_DIRECTIVES, ...PIPES],
  exports: [
    CommonModule,
    FormsModule,
    ...SHARED_COMPONENTS,
    ...SHARED_DIRECTIVES,
    ...PIPES,
    InfiniteScrollModule,
    DragDropModule
  ],
  providers: []
})
export class SharedModule {}
