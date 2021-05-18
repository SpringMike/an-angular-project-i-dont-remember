import {Component, OnInit} from '@angular/core';
import {Category} from '../../model/category';
import {FormControl, FormGroup} from '@angular/forms';
import {CategoryService} from '../../service/category/category.service';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {Product} from '../../model/product';
import {ProductService} from '../../service/product/product.service';
import {AuthenticationService} from '../../service/auth/authentication.service';
import {ShoppingCartService} from '../../service/shopping-cart/shopping-cart.service';
import {ItemService} from '../../service/item/item.service';
import {UserToken} from '../../model/user-token';
import {ShoppingCart} from '../../model/shopping-cart';
import {HouseService} from '../../service/house/house.service';
import {House} from '../../model/house';

declare var $: any;

@Component({
  selector: 'app-category-detail',
  templateUrl: './category-detail.component.html',
  styleUrls: ['./category-detail.component.scss']
})
export class CategoryDetailComponent implements OnInit {
  listCategory: Category[] = [];
  searchForm: FormGroup = new FormGroup({
    name: new FormControl('')
  });
  currentCategory: Category;
  listHouse: House[] = [];
  listHouseSaleOff: House[] = [];
  sub: Subscription;
  currentUser: UserToken;
  listHouseLatest: House[] = [];

  constructor(private categoryService: CategoryService,
              private houseService: HouseService,
              private activatedRoute: ActivatedRoute,
              private authenticationService: AuthenticationService,
              private shoppingCartService: ShoppingCartService,
              private itemService: ItemService,
              private router: Router) {
    this.sub = this.activatedRoute.paramMap.subscribe(async (paramMap: ParamMap) => {
      const id = +paramMap.get('id');
      this.currentCategory = await this.getCategory(id);
      this.listHouse = await this.getAllHousetByCategory(this.currentCategory);
    });
    this.authenticationService.currentUser.subscribe(value => {
      this.currentUser = value;
    });
  }

  ngOnInit() {
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
      $('.hero__categories__all').on('click', function() {
        $('.hero__categories ul').slideToggle(400);
      });
      var rangeSlider = $('.price-range'),
        minamount = $('#minamount'),
        maxamount = $('#maxamount'),
        minPrice = rangeSlider.data('min'),
        maxPrice = rangeSlider.data('max');
      rangeSlider.slider({
        range: true,
        min: minPrice,
        max: maxPrice,
        values: [minPrice, maxPrice],
        slide: function(event, ui) {
          minamount.val('$' + ui.values[0]);
          maxamount.val('$' + ui.values[1]);
        }
      });
      minamount.val('$' + rangeSlider.slider('values', 0));
      maxamount.val('$' + rangeSlider.slider('values', 1));
    });
    this.getAllCategories();
    this.getAllHouseSaleOff();
    this.getAllHouseLatest();
  }


  getAllCategories() {
    this.categoryService.getAllCategoryStatusTrue().subscribe(listCategory => {
      this.listCategory = listCategory;
    });
  }

  getAllHousetByCategory(category: Category) {
    return this.categoryService.getHouseByCategory(category.id).toPromise();
  }

  getCategory(id: number) {
    return this.categoryService.getCategory(id).toPromise();
  }

  getAllHouseSaleOff() {
    this.houseService.findByStatusTrueOrderByDiscountDesc().subscribe(listHouse => {
      this.listHouseSaleOff = listHouse;
      this.listHouseSaleOff.map(async house => {
        $(document).ready(function() {
          $('.product__discount__slider').owlCarousel({
            loop: true,
            margin: 0,
            items: 3,
            dots: true,
            smartSpeed: 1500,
            autoHeight: false,
            autoplay: true,
            responsive: {
              320: {
                items: 1,
              },

              480: {
                items: 2,
              },
              768: {
                items: 3,
              }
            }
          });
        });
      });
    });
  }

  getAllHouseLatest() {
    this.houseService.getAllHouseStatusTrue().subscribe(listProduct => {
      if (listProduct.length > 3) {
        for (let i = 0; i < 3; i++) {
          this.listHouseLatest.push(listProduct[i]);
        }
      } else {
        this.listHouseLatest = listProduct;
      }
    });
  }

  search() {
    const address = this.searchForm.value.name;
    this.router.navigate(['../houses'], {queryParams: {address: address}});
  }
}
