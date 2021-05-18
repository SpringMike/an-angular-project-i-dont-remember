import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {AuthGuard} from '../helper/auth-guard';
import {ListUtilitiesComponent} from './list-utilities/list-utilities.component';


const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    component: ListUtilitiesComponent
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UtilitiesRoutingModule {
}
