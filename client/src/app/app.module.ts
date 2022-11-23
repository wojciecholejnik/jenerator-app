import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { NavigationComponent } from './navigation/navigation.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AddOpenComponent } from './add-open/add-open.component';
import { AddSingleComponent } from './add-single/add-single.component';
import { AddMultiComponent } from './add-multi/add-multi.component';
import { GenerateComponent } from './generate/generate.component';
import { PreviewComponent } from './preview/preview.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { LoginComponent } from './login/login.component';
import { MainComponent } from './main/main.component';
import { AccountComponent } from './account/account.component';
import { TestCardComponent } from './test-card/test-card.component';
import { EditQuestionComponent } from './edit-question/edit-question.component';
import { ToastComponent } from './toast/toast.component';
import { UserService } from './user.service';
import { DataService } from './data-service.service';
import { UserSettingsModalComponent } from './account/user-settings-modal/user-settings-modal.component';

@NgModule({
  declarations: [
    AppComponent,
    NavigationComponent,
    AddOpenComponent,
    AddSingleComponent,
    AddMultiComponent,
    GenerateComponent,
    PreviewComponent,
    LoginComponent,
    MainComponent,
    AccountComponent,
    TestCardComponent,
    EditQuestionComponent,
    ToastComponent,
    UserSettingsModalComponent,
  ],
  imports: [
    //AppRoutingModule,
    BrowserModule,
    NgbModule,
    FormsModule,
    HttpClientModule,
  ],
  providers: [UserService, DataService],
  bootstrap: [AppComponent]
})
export class AppModule { }
