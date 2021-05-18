import {Component, OnInit, ViewChild} from '@angular/core';
import {Category} from '../../model/category';
import {UserToken} from '../../model/user-token';
import {CategoryService} from '../../service/category/category.service';
import {AuthenticationService} from '../../service/auth/authentication.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ItemBillComponent} from './item-bill/item-bill.component';
import {HouseService} from '../../service/house/house.service';
import {House} from '../../model/house';
import {BillService} from '../../service/bill/bill.service';
import {Bill} from '../../model/bill';

declare var $: any;
declare var Swal: any;

@Component({
  selector: 'app-bill',
  templateUrl: './bill.component.html',
  styleUrls: ['./bill.component.scss']
})
export class BillComponent implements OnInit {
  // @ts-ignore
  @ViewChild(ItemBillComponent) view!: ItemBillComponent;
  listHouseOfHost: House[];
  listBill: Bill[];
  currentUser: UserToken;
  hasRoleUser = false;
  hasRoleAdmin = false;
  isDelete = true;
  id: number;
  listDelete: number[] = [];
  listFilterResult: Bill[] = [];
  isSelected = true;

  constructor(private categoryService: CategoryService,
              private modalService: NgbModal,
              private billService: BillService,
              private houseService: HouseService,
              private authenticationService: AuthenticationService) {
    this.authenticationService.currentUser.subscribe(value => this.currentUser = value);
    if (this.currentUser) {
      const roleList = this.currentUser.roles;
      for (const role of roleList) {
        if (role.authority === 'ROLE_USER') {
          this.hasRoleUser = true;
        }
        if (role.authority === 'ROLE_ADMIN') {
          this.hasRoleAdmin = true;
        }
      }
    }
  }


  ngOnInit() {
    this.getllHouseByHost();
  }

  getCategoryId(id: number) {
    this.id = id;
  }

  initModal(model: any, type = null): void {
    this.view.view(model, type);
  }

  checkAllCheckBox(ev) {
    this.listBill.forEach((x) => (x.checked = ev.target.checked));
    this.changeModel();
  }

  changeModel() {
    const selectedCategory = [...this.listBill]
      .filter((bill) => bill.checked)
      .map((p) => p.id);
    if (selectedCategory.length > 0) {
      this.isDelete = false;
    } else {
      this.isDelete = true;
    }
  }

  deleteCategory() {
    this.billService.deleteBill(this.id).subscribe(() => {
      $(function() {
        $('#modal-delete').modal('hide');
      });
      $(function() {
        const Toast = Swal.mixin({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000
        });

        Toast.fire({
          type: 'success',
          title: 'Xóa thành công'
        });
      });
    }, () => {
      $(function() {
        const Toast = Swal.mixin({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000
        });

        Toast.fire({
          type: 'error',
          title: 'Xóa thất bại'
        });
      });
    });
  }

  getllHouseByHost() {
    const user = {
      id: this.currentUser.id
    };
    this.houseService.getAllHouseByUser(user).subscribe(listHouseOfHost => {
      this.listHouseOfHost = listHouseOfHost;
    });
  }

  deleteListBill() {
    for (var i = 0; i < this.listBill.length; i++) {
      if (this.listBill[i].checked === true) {
        this.listDelete.push(this.listBill[i].id);
      }
    }
    this.billService.deleteListBill(this.listDelete).subscribe(res => {
        // this.getAllCategory();
        $(function() {
          $('#modal-delete-list').modal('hide');
        });
        $(function() {
          const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000
          });

          Toast.fire({
            type: 'success',
            title: 'Xóa thành công'
          });
        });
        this.listDelete = [];
      },
      err => {
        $(function() {
          const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000
          });

          Toast.fire({
            type: 'error',
            title: 'Xóa thất bại'
          });
        });
      });
  }

  changeStatus(event: any) {
    let list = [];
    // tslint:disable-next-line: radix
    switch (parseInt(event)) {
      case -1:
        this.listBill = [...this.listFilterResult];
        break;
      case 1:
        list = [...this.listFilterResult];
        this.listBill = list.filter(item => item.status === true);
        break;
      case 0:
        list = [...this.listFilterResult];
        this.listBill = list.filter(item => item.status === false);
        break;
      default:
        break;
    }
  }

  changeHouse(event: number) {
    const bill = {
      id: event
    };
    this.billService.getAllBillByHouse(bill).subscribe(listBill => {
      this.listBill = listBill;
      this.listFilterResult = this.listBill;
      $(function() {
        $('#table-category').DataTable({
          'paging': true,
          'lengthChange': true,
          'retrieve': true,
          'searching': true,
          'ordering': false,
          'info': false,
          'autoWidth': true,
        });
      });
    });
  }
}
