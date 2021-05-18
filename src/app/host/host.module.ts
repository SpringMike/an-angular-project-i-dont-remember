import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {HostRoutingModule} from './host-routing.module';
import {HouseComponent} from './house/house.component';
import {CategoryComponent} from './category/category.component';
import {GraphComponent} from './graph/graph.component';
import {ServiceComponent} from './service/service.component';
import {ReportComponent} from './report/report.component';
import {BillComponent} from './bill/bill.component';
import {UtilitiesComponent} from './utilities/utilities.component';
import {CategoryItemComponent} from './category/category-item/category-item.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgbModalModule, NgbPaginationModule} from '@ng-bootstrap/ng-bootstrap';
import {ServiceItemComponent} from './service/service-item/service-item.component';
import {UtilitiesItemComponent} from './utilities/utilities-item/utilities-item.component';
import {ItemHouseComponent} from './house/item-house/item-house.component';
import {NgImageSliderModule} from 'ng-image-slider';
import {ItemBillComponent} from './bill/item-bill/item-bill.component';


@NgModule({
  declarations: [HouseComponent, CategoryComponent, GraphComponent, ServiceComponent, ReportComponent, BillComponent, UtilitiesComponent, CategoryItemComponent, ServiceItemComponent, UtilitiesItemComponent, ItemHouseComponent, ItemBillComponent],
  imports: [
    CommonModule,
    HostRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    NgbModalModule,
    NgbPaginationModule,
    NgImageSliderModule
  ]
})
export class HostModule {
}
