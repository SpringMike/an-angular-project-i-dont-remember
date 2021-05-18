import {Component, OnInit} from '@angular/core';
import {Category} from '../../model/category';
import {Service} from '../../model/service';
import {Bill} from '../../model/bill';
import {FormControl, FormGroup} from '@angular/forms';
import {Item} from '../../model/item';
import {UserToken} from '../../model/user-token';
import {CategoryService} from '../../service/category/category.service';
import {BillService} from '../../service/bill/bill.service';
import {AuthenticationService} from '../../service/auth/authentication.service';
import {HouseService} from '../../service/house/house.service';
import {ServiceService} from '../../service/service/service.service';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {House} from '../../model/house';

declare var $: any;
declare var Swal: any;

@Component({
  selector: 'app-confirm',
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.scss']
})
export class ConfirmComponent implements OnInit {
  listCategory: Category[] = [];
  listService: Service[] = [];
  bill: Bill;
  searchForm: FormGroup = new FormGroup({
    name: new FormControl('')
  });
  sub: Subscription;
  currentUser: UserToken;
  currentBill: Bill;
  id: any;

  constructor(private categoryService: CategoryService,
              private billService: BillService,
              private authenticationService: AuthenticationService,
              private houseService: HouseService,
              private activatedRoute: ActivatedRoute,
              private serviceService: ServiceService,
              private router: Router) {
    this.sub = this.activatedRoute.paramMap.subscribe(async (paramMap: ParamMap) => {
      this.id = +paramMap.get('id');
      console.log(this.id);
      this.currentBill = await this.getBill(this.id);
      this.billService.confirmBill(this.id, this.currentBill).subscribe();
    });
    this.authenticationService.currentUser.subscribe(value => {
      this.currentUser = value;
    });
  }

  ngOnInit() {
    $(document).ready(function() {
      $('.hero__categories__all').on('click', function() {
        $('.hero__categories ul').slideToggle(400);
      });
    });
    this.getAllCategories();
  }

  getBill(id: number) {
    return this.billService.getBill(id).toPromise();
  }

  getAllCategories() {
    this.categoryService.getAllCategoryStatusTrue().subscribe(listCategory => {
      this.listCategory = listCategory;
    });
  }

  search() {
    const address = this.searchForm.value.name;
    this.router.navigate(['../houses'], {queryParams: {address: address}});
  }
}
