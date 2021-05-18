import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {NavbarComponent} from './shared/navbar/navbar.component';
import {LayoutWithSharedComponent} from './layout/layout-with-shared/layout-with-shared.component';
import {SidebarComponent} from './shared/sidebar/sidebar.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {JwtInterceptor} from './helper/jwt-interceptor';
import {ErrorInterceptor} from './helper/error-interceptor';
import {LoginComponent} from './auth/login/login.component';
import {ReactiveFormsModule} from '@angular/forms';
import {RegisterComponent} from './auth/register/register.component';
import {AngularFireModule} from '@angular/fire';
import {environment} from '../environments/environment';
import {AngularFireStorageModule} from '@angular/fire/storage';
import {AngularFireDatabaseModule} from '@angular/fire/database';
import {HomepageComponent} from './user/homepage/homepage.component';
import {ShopComponent} from './user/shop/shop.component';
import {HeaderComponent} from './shared/header/header.component';
import {FooterComponent} from './shared/footer/footer.component';
import {ContactComponent} from './user/contact/contact.component';
import {ProductDetailComponent} from './user/product-detail/product-detail.component';
import {ShoppingCartComponent} from './user/shopping-cart/shopping-cart.component';
import {CheckoutComponent} from './user/checkout/checkout.component';
import {CategoryDetailComponent} from './user/category-detail/category-detail.component';
import {FavoriteComponent} from './user/favorite/favorite.component';
import {UserOrderComponent} from './user/user-order/user-order.component';
import {AdminComponent} from './admin/admin.component';
import {LayoutHostComponent} from './layout/layout-host/layout-host.component';
import {Login1Component} from './auth/login1/login1.component';
import {Register1Component} from './auth/register1/register1.component';
import {NgImageSliderModule} from 'ng-image-slider';
import {NgbModalModule, NgbPaginationModule} from '@ng-bootstrap/ng-bootstrap';
import {ConfirmComponent} from './user/confirm/confirm.component';
import {UserItemComponent} from './shared/header/user-item/user-item.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatDatepickerModule, MatInputModule, MatNativeDateModule} from '@angular/material';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    LayoutWithSharedComponent,
    SidebarComponent,
    LoginComponent,
    RegisterComponent,
    HomepageComponent,
    ShopComponent,
    HeaderComponent,
    FooterComponent,
    ContactComponent,
    ProductDetailComponent,
    ShoppingCartComponent,
    CheckoutComponent,
    CategoryDetailComponent,
    FavoriteComponent,
    UserOrderComponent,
    AdminComponent,
    LayoutHostComponent,
    Login1Component,
    Register1Component,
    ConfirmComponent,
    UserItemComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireStorageModule,
    AngularFireDatabaseModule,
    NgImageSliderModule,
    NgbPaginationModule,
    NgbModalModule,
    BrowserAnimationsModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true}],
  bootstrap: [AppComponent]
})
export class AppModule {
}
