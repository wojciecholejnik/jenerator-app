import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingComponent } from './loading/loading.component';
import { ToastContainerComponent } from './toast-service/toast-container/toast-container.component';
import { NgbToastModule } from '@ng-bootstrap/ng-bootstrap';
import { PaginationFooterComponent } from './pagination-footer/pagination-footer.component';



@NgModule({
  declarations: [
    LoadingComponent,
    ToastContainerComponent,
    PaginationFooterComponent
  ],
  imports: [
    CommonModule,
    NgbToastModule
  ],
  exports: [
    LoadingComponent,
    ToastContainerComponent,
    PaginationFooterComponent
  ]
})
export class SharedModule { }
