import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {AuthGuard} from '../helper/auth-guard';
import {ListServicehouseComponent} from './list-servicehouse/list-servicehouse.component';


const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    component: ListServicehouseComponent
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ServicehouseRoutingModule {
}
