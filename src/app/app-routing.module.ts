import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LayoutComponent} from "./shared/layout/layout.component";
import {MainComponent} from "./views/main/main.component";
import {UserAgreementComponent} from "./user-agreement/user-agreement.component";

const routes: Routes = [{
  path: '',
  component: LayoutComponent,
  children: [
    {path: '', component: MainComponent},
    {path: 'user-agreement', component: UserAgreementComponent},
    {path: '', loadChildren: () => import('./views/user/user.module').then(m => m.UserModule)},
    {path: '', loadChildren: () => import('./views/blog-articles/blog-articles.module').then(m => m.BlogArticlesModule)},
  ]
}];

@NgModule({
  imports: [RouterModule.forRoot(routes, {anchorScrolling:'enabled'})],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
