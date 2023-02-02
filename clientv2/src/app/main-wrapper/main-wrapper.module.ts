import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainWrapperComponent } from './main-wrapper/main-wrapper.component';
import { LeftMenuComponent } from './left-menu/left-menu.component';
import { RouterModule, Routes } from '@angular/router';
import { TopMenuComponent } from './top-menu/top-menu.component';
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { OverviewComponent } from './overview/overview.component';
import { CategoriesComponent } from './overview/categories/categories/categories.component';
import { CategoriesTableComponent } from './overview/categories/categories-table/categories-table.component';
import { CategoriesSearchComponent } from './overview/categories/categories-search/categories-search.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CategoriesModalComponent } from './overview/categories/categories-modal/categories-modal.component';
import { QuestionsComponent } from './overview/questions/questions/questions.component';
import { CategorySelectorComponent } from './overview/questions/category-selector/category-selector.component';
import { QuestionsTableComponent } from './overview/questions/questions-table/questions-table.component';
import { SharedModule } from '../shared/shared.module';
import { QuestionPreviewComponent } from './overview/questions/question-preview/question-preview.component';
import { TypeSelectorComponent } from './overview/questions/type-selector/type-selector.component';
import { DeleteConfirmationComponent } from './overview/questions/delete-confirmation/delete-confirmation.component';
import { GeneratorComponent } from './generator/generator.component';
import { NewTestComponent } from './generator/new-test/new-test.component';
import { TestsTableComponent } from './generator/tests-table/tests-table.component';
import { TestPreviewComponent } from './generator/test-preview/test-preview.component';
import { DeleteTestConfirmationComponent } from './generator/delete-test-confirmation/delete-test-confirmation.component';
import { HelpComponent } from './help/help.component';
import { ManageWrapperComponent } from './manage/manage-wrapper/manage-wrapper.component';
import { MainWrapperRoutingModule } from './main-wrapper.routes';
import { UsersTableComponent } from './manage/users-table/users-table.component';
import { AddUserComponent } from './manage/add-user/add-user.component';
import { DeleteUserConfirmationComponent } from './manage/delete-user-confirmation/delete-user-confirmation.component';


@NgModule({
  declarations: [
    MainWrapperComponent,
    LeftMenuComponent,
    TopMenuComponent,
    OverviewComponent,
    CategoriesComponent,
    CategoriesTableComponent,
    CategoriesSearchComponent,
    CategoriesModalComponent,
    QuestionsComponent,
    CategorySelectorComponent,
    QuestionsTableComponent,
    QuestionPreviewComponent,
    TypeSelectorComponent,
    DeleteConfirmationComponent,
    GeneratorComponent,
    NewTestComponent,
    TestsTableComponent,
    TestPreviewComponent,
    DeleteTestConfirmationComponent,
    HelpComponent,
    ManageWrapperComponent,
    UsersTableComponent,
    AddUserComponent,
    DeleteUserConfirmationComponent
  ],
  imports: [
    CommonModule,
    MainWrapperRoutingModule,    
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    FormsModule,
    SharedModule,
    ReactiveFormsModule
  ],
  exports: [
    MainWrapperComponent
  ]
})
export class MainWrapperModule { }
