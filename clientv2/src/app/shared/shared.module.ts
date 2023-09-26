import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingComponent } from './loading/loading.component';
import { ToastContainerComponent } from './toast-service/toast-container/toast-container.component';
import { NgbToastModule } from '@ng-bootstrap/ng-bootstrap';



@NgModule({
  declarations: [
    LoadingComponent,
    ToastContainerComponent
  ],
  imports: [
    CommonModule,
    NgbToastModule
  ],
  exports: [
    LoadingComponent,
    ToastContainerComponent
  ]
})
export class SharedModule { }
