import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ItemCategoryComponent} from './list-category/item-category/item-category.component';
import {ListCategoryComponent} from './list-category/list-category.component';
import {CategoryRoutingModule} from './category-routing.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgbModalModule} from '@ng-bootstrap/ng-bootstrap';


@NgModule({
  declarations: [
    ListCategoryComponent,
    ItemCategoryComponent,
  ],
  imports: [
    CommonModule,
    CategoryRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    NgbModalModule
  ]
})
export class CategoryModule {
}
