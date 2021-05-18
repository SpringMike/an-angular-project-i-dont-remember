import {Component, OnInit} from '@angular/core';
import {ProductService} from '../../service/product/product.service';
import {Product} from '../../model/product';
import {CategoryService} from '../../service/category/category.service';
import {Category} from '../../model/category';
import {FormControl, FormGroup} from '@angular/forms';
import {Router} from '@angular/router';
import {AuthenticationService} from '../../service/auth/authentication.service';
import {UserToken} from '../../model/user-token';
import {ShoppingCartService} from '../../service/shopping-cart/shopping-cart.service';
import {ShoppingCart} from '../../model/shopping-cart';
import {ItemService} from '../../service/item/item.service';
import {House} from '../../model/house';
import {HouseService} from '../../service/house/house.service';

declare var $: any;

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent implements OnInit {
  listHouse: House[] = [];
  listCategory: Category[] = [];
  searchForm: FormGroup = new FormGroup({
    name: new FormControl('')
  });
  listHouseLatest: House[] = [];
  listHouseDiscount: House[] = [];
  listHouseNumberHire: House[] = [];
  currentUser: UserToken;

  constructor(private houseService: HouseService,
              private categoryService: CategoryService,
              private authenticationService: AuthenticationService,
              private shoppingCartService: ShoppingCartService,
              private itemService: ItemService,
              private router: Router) {
    this.authenticationService.currentUser.subscribe(value => {
      this.currentUser = value;
    });
  }

  ngOnInit() {
    // tslint:disable-next-line:only-arrow-functions
    $(document).ready(function() {
      $('.latest-product__slider').owlCarousel({
        loop: true,
        margin: 0,
        items: 1,
        dots: false,
        nav: true,
        navText: ['<span class=\'fa fa-angle-left\'><span/>', '<span class=\'fa fa-angle-right\'><span/>'],
        smartSpeed: 1200,
        autoHeight: false,
        autoplay: true
      });
      // tslint:disable-next-line:only-arrow-functions
      $('.hero__categories__all').on('click', function() {
        $('.hero__categories ul').slideToggle(400);
      });
      $('.categories__slider').owlCarousel({
        loop: true,
        margin: 0,
        items: 4,
        dots: false,
        nav: true,
        navText: ['<span class=\'fa fa-angle-left\'><span/>', '<span class=\'fa fa-angle-right\'><span/>'],
        animateOut: 'fadeOut',
        animateIn: 'fadeIn',
        smartSpeed: 1200,
        autoHeight: false,
        autoplay: true,
        responsive: {

          0: {
            items: 1,
          },

          480: {
            items: 2,
          },

          768: {
            items: 3,
          },

          992: {
            items: 4,
          }
        }
      });
    });
    this.getAllHouseLatest();
    this.getAllHouse();
    this.getAllCategories();
    this.getAllHouseDiscount();
    this.getAllHouseNumberHiresDesc();
  }

  getAllHouse() {
    this.houseService.getAllHouseStatusTrue().subscribe(listHouse => {
      if (listHouse.length > 8) {
        for (let i = 0; i < 8; i++) {
          this.listHouse.push(listHouse[i]);
        }
      } else {
        this.listHouse = listHouse;
      }
    });
  }

  getAllCategories() {
    this.categoryService.getAllCategoryStatusTrue().subscribe(listCategory => {
      this.listCategory = listCategory;
    });
  }

  getAllHouseLatest() {
    this.houseService.getAllHouseStatusTrue().subscribe(listHouse => {
      if (listHouse.length > 4) {
        for (let i = 0; i < 4; i++) {
          this.listHouseLatest.push(listHouse[i]);
        }
      } else {
        this.listHouseLatest = listHouse;
      }
    });
  }

  getAllHouseDiscount() {
    this.houseService.findByStatusTrueOrderByDiscountDesc().subscribe(listHouse => {
      if (listHouse.length > 4) {
        for (let i = 0; i < 4; i++) {
          this.listHouseDiscount.push(listHouse[i]);
        }
      } else {
        this.listHouseDiscount = listHouse;
      }
    });
  }

  getAllHouseNumberHiresDesc() {
    this.houseService.findByOrderByNumberHiresDesc().subscribe(listHouse => {
      if (listHouse.length > 4) {
        for (let i = 0; i < 4; i++) {
          this.listHouseNumberHire.push(listHouse[i]);
        }
      } else {
        this.listHouseNumberHire = listHouse;
      }
    });
  }

  search() {
    const address = this.searchForm.value.name;
    this.router.navigate(['../houses'], {queryParams: {address}});
  }
}
