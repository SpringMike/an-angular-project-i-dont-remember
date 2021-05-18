import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {UsersRoutingModule} from './users-routing.module';
import {ListuserComponent} from './listuser/listuser.component';
import {NgbModalModule} from '@ng-bootstrap/ng-bootstrap';
import {ReactiveFormsModule} from '@angular/forms';


@NgModule({
  declarations: [ListuserComponent],
  imports: [
    CommonModule,
    UsersRoutingModule,
    NgbModalModule,
    ReactiveFormsModule
  ]
})
export class UsersModule {
}
