import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatFormFieldModule} from "@angular/material/form-field";
import {ReactiveFormsModule} from "@angular/forms";
import {ModalComponent} from "./components/modal/modal.component";
import {ArticleCardsComponent} from "./components/article-cards/article-cards.component";
import {MatSelectModule} from "@angular/material/select";
import {RouterModule} from "@angular/router";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {LoaderComponent} from "./components/loader/loader.component";


@NgModule({
  declarations: [
    ModalComponent,
    ArticleCardsComponent,
    LoaderComponent
  ],
  imports: [
    CommonModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatSelectModule,
    RouterModule,
    MatProgressSpinnerModule,

  ],
  exports: [ArticleCardsComponent, LoaderComponent]
})
export class SharedModule {
}
