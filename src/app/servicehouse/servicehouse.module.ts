import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {ServicehouseRoutingModule} from './servicehouse-routing.module';
import {ListServicehouseComponent} from './list-servicehouse/list-servicehouse.component';
import {ItemservicehouseComponent} from './itemservicehouse/itemservicehouse.component';
import {NgbModalModule} from '@ng-bootstrap/ng-bootstrap';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';


@NgModule({
  declarations: [ListServicehouseComponent, ItemservicehouseComponent],
  imports: [
    CommonModule,
    ServicehouseRoutingModule,
    NgbModalModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class ServicehouseModule {
}
