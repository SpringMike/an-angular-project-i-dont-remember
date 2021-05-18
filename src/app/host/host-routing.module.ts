import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {HouseComponent} from './house/house.component';
import {CategoryComponent} from './category/category.component';
import {GraphComponent} from './graph/graph.component';
import {ServiceComponent} from './service/service.component';
import {ReportComponent} from './report/report.component';
import {BillComponent} from './bill/bill.component';
import {UtilitiesComponent} from './utilities/utilities.component';
import {AuthGuard} from '../helper/auth-guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'graph',
    pathMatch: 'full'
  },
  {
    path: 'house',
    canActivate: [AuthGuard],
    component: HouseComponent,
  }, {
    path: 'category',
    canActivate: [AuthGuard],
    component: CategoryComponent,
  }, {
    path: 'graph',
    canActivate: [AuthGuard],
    component: GraphComponent,
  }, {
    path: 'service',
    canActivate: [AuthGuard],
    component: ServiceComponent,
  }, {
    path: 'report',
    canActivate: [AuthGuard],
    component: ReportComponent,
  }, {
    path: 'bill',
    canActivate: [AuthGuard],
    component: BillComponent,
  }, {
    path: 'utilities',
    canActivate: [AuthGuard],
    component: UtilitiesComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HostRoutingModule {
}
