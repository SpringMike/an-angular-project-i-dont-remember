import {Component, OnInit} from '@angular/core';
import {CategoryService} from '../../service/category/category.service';
import {ActivatedRoute, Router} from '@angular/router';
import {ProductService} from '../../service/product/product.service';
import {Category} from '../../model/category';
import {FormControl, FormGroup} from '@angular/forms';
import {Item} from '../../model/item';
import {Product} from '../../model/product';
import {HouseService} from '../../service/house/house.service';
import {AuthenticationService} from '../../service/auth/authentication.service';
import {UserToken} from '../../model/user-token';

declare var $: any;

@Component({
  selector: 'app-favorite',
  templateUrl: './favorite.component.html',
  styleUrls: ['./favorite.component.scss']
})
export class FavoriteComponent implements OnInit {
  listCategory: Category[] = [];
  searchForm: FormGroup = new FormGroup({
    name: new FormControl('')
  });
  items: Item[] = [];
  currentUser: UserToken;

  constructor(private categoryService: CategoryService,
              private activatedRoute: ActivatedRoute,
              private productService: ProductService,
              private houseService: HouseService,
              private authenticationService: AuthenticationService,
              private router: Router) {
    this.authenticationService.currentUser.subscribe(value => {
      this.currentUser = value;
    });
  }

  ngOnInit() {
    $(document).ready(function() {
      $('.hero__categories__all').on('click', function() {
        $('.hero__categories ul').slideToggle(400);
      });
      var proQty = $('.pro-qty');
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
    this.loadFavorite();
    this.activatedRoute.params.subscribe(async params => {
      var id = params['id'];
      if (id) {
        const house = await this.getHouse(id);
        var item: Item = {
          product: house
        };
        if (localStorage.getItem('heart-' + this.currentUser.id) == null) {
          let heart: any = [];
          heart.push(JSON.stringify(item));
          localStorage.setItem('heart-' + this.currentUser.id, JSON.stringify(heart));
        } else {
          this.addProductToFavorite(id, item);
        }
        this.loadFavorite();
      } else {
        this.loadFavorite();
      }
    });
  }

  remove(id: number): void {
    let heart: any = JSON.parse(localStorage.getItem('heart-' + this.currentUser.id));
    let index: number = -1;
    for (var i = 0; i < heart.length; i++) {
      let item: Item = JSON.parse(heart[i]);
      if (item.product.id == id) {
        heart.splice(i, 1);
        break;
      }
    }
    localStorage.setItem('heart-' + this.currentUser.id, JSON.stringify(heart));
    this.loadFavorite();
  }

  addProductToFavorite(id: number, item: Item) {
    let heart: any = JSON.parse(localStorage.getItem('heart-' + this.currentUser.id));
    let index: number = -1;
    for (var i = 0; i < heart.length; i++) {
      let item: Item = JSON.parse(heart[i]);
      if (item.product.id == id) {
        index = i;
        break;
      }
    }
    if (index == -1) {
      heart.push(JSON.stringify(item));
      localStorage.setItem('heart-' + this.currentUser.id, JSON.stringify(heart));
      this.loadFavorite();
    }
  }

  getHouse(id: number) {
    return this.houseService.getHouse(id).toPromise();
  }

  getAllCategories() {
    this.categoryService.getAllCategoryStatusTrue().subscribe(listCategory => {
      this.listCategory = listCategory;
    });
  }


  loadFavorite(): void {
    this.items = [];
    let heart = JSON.parse(localStorage.getItem('heart-' + this.currentUser.id));
    if (heart != null) {
      for (var i = 0; i < heart.length; i++) {
        let item = JSON.parse(heart[i]);
        this.items.push({
          product: item.product
        });
      }
    }
  }

  search() {
    const address = this.searchForm.value.name;
    this.router.navigate(['../houses'], {queryParams: {address: address}});
  }
}
