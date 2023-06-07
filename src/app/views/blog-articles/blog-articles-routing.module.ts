import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ArticleComponent} from "./article/article.component";
import {BlogComponent} from "./blog/blog.component";

const routes: Routes = [
  {path: 'blog', component: BlogComponent},
  {path: 'article/:url', component: ArticleComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BlogArticlesRoutingModule { }
