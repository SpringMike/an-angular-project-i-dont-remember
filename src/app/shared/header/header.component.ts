import {Component, OnInit, ViewChild} from '@angular/core';
import {CategoryService} from '../../service/category/category.service';
import {AuthenticationService} from '../../service/auth/authentication.service';
import {Router} from '@angular/router';
import {Category} from '../../model/category';
import {UserToken} from '../../model/user-token';
import {Item} from '../../model/item';
import {ShoppingCart} from '../../model/shopping-cart';
import {ShoppingCartService} from '../../service/shopping-cart/shopping-cart.service';
import {UserService} from '../../service/user/user.service';
import {Notification} from '../../model/notification';
import {NotificationService} from '../../service/notification/notification.service';
import {User} from '../../model/user';
import {NotificationUser} from '../../model/notificationUser';
import {CategoryItemComponent} from '../../host/category/category-item/category-item.component';
import {UserItemComponent} from './user-item/user-item.component';

declare var $: any;

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  // @ts-ignore
  @ViewChild(UserItemComponent) view!: UserItemComponent;
  listCategory: Category[] = [];
  currentUser: UserToken;
  user: User = {id: 0};
  hasRoleAdmin = false;
  hasRoleUser = false;
  items: Item[] = [];
  favoriteProduct: Item[] = [];
  listNotification: NotificationUser[] = [];

  constructor(private categoryService: CategoryService,
              private authenticationService: AuthenticationService,
              private userService: UserService,
              private notificationService: NotificationService,
              private router: Router) {
    this.authenticationService.currentUser.subscribe(value => {
      this.currentUser = value;
    });
    if (this.currentUser) {
      const roleList = this.currentUser.roles;
      for (const role of roleList) {
        if (role.authority === 'ROLE_ADMIN') {
          this.hasRoleAdmin = true;
        }
        if (role.authority === 'ROLE_USER') {
          this.hasRoleUser = true;
        }
      }
    }
    this.loadFavorite();
  }

  ngOnInit() {
    $(function() {
      $('.dropdown-menu').click(function(event) {
        event.stopPropagation();
      });
    });
    this.getAllCategories();
    if (this.currentUser != null) {
      this.user.id = this.currentUser.id;
      setInterval(() => {
        this.getAllNotificationByUser();
      }, 30000);
    }
  }

  initModal(model: any, type = null): void {
    this.view.view(model, type);
  }


  getAllCategories() {
    this.categoryService.getAllCategory().subscribe(listCategory => {
      this.listCategory = listCategory;
    });
  }

  getAllNotificationByUser() {
    this.notificationService.getAllNotificationByUser(this.user).subscribe(listNotification => {
      this.listNotification = listNotification;
    });
  }

  logout() {
    this.authenticationService.logout();
    this.router.navigate(['/login']);
  }

  loadFavorite(): void {
    this.favoriteProduct = [];
    if (this.currentUser != null) {
      let heart = JSON.parse(localStorage.getItem('heart-' + this.currentUser.id));
      if (heart != null) {
        for (var i = 0; i < heart.length; i++) {
          let item = JSON.parse(heart[i]);
          this.favoriteProduct.push({
            product: item.product
          });
        }
      }
    }
  }

  updateStatus(notification: any) {
    // tslint:disable-next-line:prefer-const
    let user: any;
    user = {
      id: notification
    };
    this.notificationService.updateNotification(user).subscribe();
    window.location.reload();
  }

  getNotification(id: number) {
    return this.notificationService.getNotification(id).toPromise();
  }
}
