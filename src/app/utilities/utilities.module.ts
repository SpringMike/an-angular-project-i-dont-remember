import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {UtilitiesRoutingModule} from './utilities-routing.module';
import {ListUtilitiesComponent} from './list-utilities/list-utilities.component';
import {ItemUtilitiesComponent} from './item-utilities/item-utilities.component';
import {NgbModalModule} from '@ng-bootstrap/ng-bootstrap';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';


@NgModule({
  declarations: [ListUtilitiesComponent, ItemUtilitiesComponent],
  imports: [
    CommonModule,
    UtilitiesRoutingModule, NgbModalModule, FormsModule, ReactiveFormsModule
  ]
})
export class UtilitiesModule {
}
