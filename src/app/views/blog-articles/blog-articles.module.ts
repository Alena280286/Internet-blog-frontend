import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BlogArticlesRoutingModule } from './blog-articles-routing.module';
import {BlogComponent} from "./blog/blog.component";
import {ArticleComponent} from "./article/article.component";
import {SharedModule} from "../../shared/shared.module";
import {ReactiveFormsModule} from "@angular/forms";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";


@NgModule({
  declarations: [
    BlogComponent,
    ArticleComponent,
  ],
  imports: [
    CommonModule,
    BlogArticlesRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule
  ]
})
export class BlogArticlesModule { }
