import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {AuthGuard} from '../helper/auth-guard';
import {ListuserComponent} from './listuser/listuser.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    component: ListuserComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersRoutingModule {
}
