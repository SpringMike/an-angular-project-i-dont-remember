import {Component, OnInit} from '@angular/core';
import {Category} from '../../model/category';
import {FormControl, FormGroup} from '@angular/forms';
import {CategoryService} from '../../service/category/category.service';
import {Product} from '../../model/product';
import {ProductService} from '../../service/product/product.service';
import {Subscription} from 'rxjs';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {AuthenticationService} from '../../service/auth/authentication.service';
import {ShoppingCartService} from '../../service/shopping-cart/shopping-cart.service';
import {ItemService} from '../../service/item/item.service';
import {UserToken} from '../../model/user-token';
import {ShoppingCart} from '../../model/shopping-cart';
import {Review} from '../../model/review';
import {ReviewService} from '../../service/review/review.service';
import {House} from '../../model/house';
import {HouseService} from '../../service/house/house.service';

declare var $: any;

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss']
})
export class ProductDetailComponent implements OnInit {
  listCategory: Category[] = [];
  searchForm: FormGroup = new FormGroup({
    name: new FormControl('')
  });
  currentHouse: House;
  sub: Subscription;
  relatedHouses: House[] = [];
  currentUser: UserToken;
  listReview: Review[] = [];
  starAverage: number = 0;
  imageObject: Array<object> = [];
  id: any;

  constructor(private categoryService: CategoryService,
              private houseService: HouseService,
              private reviewService: ReviewService,
              private activatedRoute: ActivatedRoute,
              private authenticationService: AuthenticationService,
              private itemService: ItemService,
              private router: Router) {
    this.sub = this.activatedRoute.paramMap.subscribe(async (paramMap: ParamMap) => {
      this.id = +paramMap.get('id');
      this.currentHouse = await this.getHouse(this.id);
      for (var i = 0; i < this.currentHouse.images.length; i++) {
        this.imageObject[i] = {
          image: this.currentHouse.images[i].link,
          thumbImage: this.currentHouse.images[i].link
        };
      }
      // this.getAllReview(id);
      this.getAllHouseRelated(this.currentHouse.category);
    });
    this.authenticationService.currentUser.subscribe(value => {
      this.currentUser = value;
    });
  }

  ngOnInit() {
    $(document).ready(function() {
      $('.product__details__pic__slider').owlCarousel({
        loop: true,
        margin: 20,
        items: 4,
        dots: true,
        smartSpeed: 1200,
        autoHeight: false,
        autoplay: true
      });
      $('.product__details__pic__slider img').on('click', function() {
        var imgurl = $(this).data('imgbigurl');
        var bigImg = $('.product__details__pic__item--large').attr('src');
        if (imgurl != bigImg) {
          $('.product__details__pic__item--large').attr({
            src: imgurl
          });
        }
      });
      var proQty = $('.pro-qty');
      proQty.prepend('<span class="dec qtybtn">-</span>');
      proQty.append('<span class="inc qtybtn">+</span>');
      proQty.on('click', '.qtybtn', function() {
        var $button = $(this);
        var oldValue = $button.parent().find('input').val();
        if ($button.hasClass('inc')) {
          var newVal = parseFloat(oldValue) + 1;
        } else {
          // Don't allow decrementing below zero
          if (oldValue > 0) {
            var newVal = parseFloat(oldValue) - 1;
          } else {
            newVal = 0;
          }
        }
        $button.parent().find('input').val(newVal);
      });
    });
    this.getAllCategories();
  }

  // getAllReview(productId: number) {
  //   this.productService.getAllReviewByProduct(productId).subscribe(listReview => {
  //     let sum = 0;
  //     this.listReview = listReview;
  //     this.listReview.map(review => {
  //       review.createDate = new Date(review.createDate);
  //       sum += review.evaluate;
  //     });
  //     this.starAverage = sum / this.listReview.length;
  //   });
  // }

  getAllCategories() {
    this.categoryService.getAllCategoryStatusTrue().subscribe(listCategory => {
      this.listCategory = listCategory;
    });
  }

  getHouse(id: number) {
    return this.houseService.getHouse(id).toPromise();
  }

  getAllHouseRelated(category: Category) {
    this.categoryService.getHouseByCategory(category.id).subscribe(listHouse => {
      if (listHouse.length > 4) {
        for (let i = 0; i < 4; i++) {
          this.relatedHouses.push(listHouse[i]);
        }
      } else {
        this.relatedHouses = listHouse;
      }
    });
  }

  search() {
    const address = this.searchForm.value.name;
    this.router.navigate(['../houses'], {queryParams: {address: address}});
  }

  createMessage() {
    this.houseService.changeMessage(this.id);
  }

}
