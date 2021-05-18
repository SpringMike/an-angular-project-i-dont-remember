import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AuthGuard} from '../helper/auth-guard';
import {ListCategoryComponent} from './list-category/list-category.component';

const routes: Routes = [{
  path: '',
  canActivate: [AuthGuard],
  component: ListCategoryComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CategoryRoutingModule {
}
