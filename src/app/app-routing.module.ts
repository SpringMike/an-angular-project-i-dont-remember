import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {LayoutWithSharedComponent} from './layout/layout-with-shared/layout-with-shared.component';
import {LoginComponent} from './auth/login/login.component';
import {RegisterComponent} from './auth/register/register.component';
import {HomepageComponent} from './user/homepage/homepage.component';
import {AdminAuthGuard} from './helper/admin-auth-guard';
import {ShopComponent} from './user/shop/shop.component';
import {ContactComponent} from './user/contact/contact.component';
import {ProductDetailComponent} from './user/product-detail/product-detail.component';
import {ShoppingCartComponent} from './user/shopping-cart/shopping-cart.component';
import {CheckoutComponent} from './user/checkout/checkout.component';
import {CategoryDetailComponent} from './user/category-detail/category-detail.component';
import {FavoriteComponent} from './user/favorite/favorite.component';
import {UserOrderComponent} from './user/user-order/user-order.component';
import {AdminComponent} from './admin/admin.component';
import {LayoutHostComponent} from './layout/layout-host/layout-host.component';
import {AuthGuard} from './helper/auth-guard';
import {Login1Component} from './auth/login1/login1.component';
import {Register1Component} from './auth/register1/register1.component';
import {ConfirmComponent} from './user/confirm/confirm.component';


const routes: Routes = [
  {
    path: 'admin',
    component: LayoutWithSharedComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        redirectTo: 'user',
        pathMatch: 'full'
      },
      {
        path: 'house',
        loadChildren: () => import('./product/product.module').then(module => module.ProductModule)
      },
      {
        path: 'category',
        loadChildren: () => import('./category/category.module').then(module => module.CategoryModule)
      },
      {
        path: 'utilities',
        loadChildren: () => import('./utilities/utilities.module').then(module => module.UtilitiesModule)
      },
      {
        path: 'service',
        loadChildren: () => import('./servicehouse/servicehouse.module').then(module => module.ServicehouseModule)
      }
      ,
      {
        path: 'user',
        loadChildren: () => import('./users/users.module').then(module => module.UsersModule)
      }
    ],
  }, {
    path: 'host',
    component: LayoutHostComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        loadChildren: () => import('./host/host.module').then(module => module.HostModule)
      }
    ],
  },
  {
    path: '',
    component: HomepageComponent
  },
  {
    path: 'houses',
    component: ShopComponent
  },
  {
    path: 'contact',
    component: ContactComponent
  },
  {
    path: 'house/:id',
    component: ProductDetailComponent
  },
  {
    path: 'cart',
    component: ShoppingCartComponent
  },
  {
    path: 'favorite',
    component: FavoriteComponent
  },
  {
    path: 'checkout',
    component: CheckoutComponent
  },
  {
    path: 'category/:id',
    component: CategoryDetailComponent
  },
  {
    path: 'confirm/:id',
    component: ConfirmComponent
  },
  {
    path: 'login',
    component: Login1Component
  },
  {
    path: 'register',
    component: Register1Component
  },
  {
    path: 'order',
    component: UserOrderComponent
  },
  {
    path: '**',
    redirectTo: ''
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
