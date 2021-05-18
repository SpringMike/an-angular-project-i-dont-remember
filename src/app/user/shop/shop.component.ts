import {Component, OnInit} from '@angular/core';
import {Category} from '../../model/category';
import {CategoryService} from '../../service/category/category.service';
import {Product} from '../../model/product';
import {ProductService} from '../../service/product/product.service';
import {FormControl, FormGroup} from '@angular/forms';
import {Subscription} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';
import {UserToken} from '../../model/user-token';
import {ShoppingCart} from '../../model/shopping-cart';
import {AuthenticationService} from '../../service/auth/authentication.service';
import {ShoppingCartService} from '../../service/shopping-cart/shopping-cart.service';
import {ItemService} from '../../service/item/item.service';
import {House} from '../../model/house';
import {HouseService} from '../../service/house/house.service';

declare var $: any;
declare var Swal: any;

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.css']
})
export class ShopComponent implements OnInit {
  listCategory: Category[] = [];
  listHouse: House[] = [];
  searchForm: FormGroup = new FormGroup({
    name: new FormControl('')
  });
  searchFormAdvanced: FormGroup = new FormGroup({
    address: new FormControl(''),
    numberRoom: new FormControl(''),
    upperBound: new FormControl(''),
    lowerBound: new FormControl(''),
  });
  listHouseSaleOff: House[] = [];
  listHouseLatest: House[] = [];
  sub: Subscription;
  query: string = '';
  currentUser: UserToken;
  page = 1;
  pageSize = 9;

  constructor(private categoryService: CategoryService,
              private activatedRoute: ActivatedRoute,
              private houseService: HouseService,
              private authenticationService: AuthenticationService,
              private shoppingCartService: ShoppingCartService,
              private itemService: ItemService,
              private router: Router) {
    this.sub = this.activatedRoute.queryParams.subscribe(params => {
      this.query = params.address;
      if (this.query != null) {
        this.searchForm.value.name = this.query;
        this.search();
      } else {
        this.getAllHouse();
      }
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
    this.getAllHouseLatest();
    this.getAllHouseSaleOff();
  }

  getAllHouse() {
    this.houseService.getAllHouseStatusTrue().subscribe(listHouse => {
      this.listHouse = listHouse;
    });
  }

  getAllCategories() {
    this.categoryService.getAllCategoryStatusTrue().subscribe(listCategory => {
      this.listCategory = listCategory;
    });
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
    if (address != null) {
      if (address == '') {
        this.router.navigate(['/houses']);
      } else {
        this.houseService.getAllHousetByName(address).subscribe(listHouse => {
          this.listHouse = listHouse;
          this.router.navigate(['/houses'], {queryParams: {address: address}});
        });
      }
    }
  }

  searchAdvanced() {
    const address = this.searchFormAdvanced.value.address;
    let numberRoom = this.searchFormAdvanced.value.numberRoom;
    let upperBound = this.searchFormAdvanced.value.upperBound;
    let lowerBound = this.searchFormAdvanced.value.lowerBound;
    if (numberRoom == '' || numberRoom == null) {
      numberRoom = 0;
    }
    if (upperBound == '' || upperBound == null) {
      upperBound = 0;
    }
    if (lowerBound == '' || lowerBound == null) {
      lowerBound = 0;
    }
    console.log(address);
    console.log(numberRoom);
    console.log(upperBound);
    console.log(lowerBound);
    if (address == '' || address == null) {
      $(function() {
        const Toast = Swal.mixin({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000
        });

        Toast.fire({
          type: 'error',
          title: 'Địa chỉ không được để trống'
        });
      });
    } else {
      this.houseService.searchAdvanced(address, numberRoom, upperBound, lowerBound).subscribe(listHouse => {
        this.listHouse = listHouse;
      });
    }
  }
}
