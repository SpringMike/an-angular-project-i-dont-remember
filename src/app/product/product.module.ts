import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ProductRoutingModule} from './product-routing.module';
import {ListProductComponent} from './list-product/list-product.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ItemProductComponent} from './list-product/item-product/item-product.component';
import {NgbModalModule, NgbPaginationModule} from '@ng-bootstrap/ng-bootstrap';
import {NgImageSliderModule} from 'ng-image-slider';


@NgModule({
  declarations: [
    ListProductComponent,
    ItemProductComponent,
  ],
    imports: [
        CommonModule,
        ProductRoutingModule,
        ReactiveFormsModule,
        NgbModalModule,
        FormsModule,
        NgbPaginationModule,
        NgImageSliderModule
    ]
})
export class ProductModule {
}
