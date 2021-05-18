import {Component, OnInit, ViewChild} from '@angular/core';
import {UserToken} from '../../model/user-token';
import {AuthenticationService} from '../../service/auth/authentication.service';
import {HouseService} from '../../service/house/house.service';
import {House} from '../../model/house';

import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ItemProductComponent} from './item-product/item-product.component';

declare var $: any;
declare var Swal: any;

@Component({
  selector: 'app-list-product',
  templateUrl: './list-product.component.html',
  styleUrls: ['./list-product.component.css']
})
export class ListProductComponent implements OnInit {
  // @ts-ignore
  @ViewChild(ItemProductComponent) view!: ItemProductComponent;
  listHouse: House[];
  currentUser: UserToken;
  hasRoleUser = false;
  hasRoleAdmin = false;
  isDelete = true;
  id: number;
  listFilterResult: House[] = [];
  listDelete: number[] = [];
  isSelected = true;

  constructor(private houseService: HouseService,
              private modalService: NgbModal,
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
    this.getAllHouse();
  }

  getHouseId(id: number) {
    this.id = id;
  }

  initModal(model: any, type = null): void {
    this.view.view(model, type);
  }

  checkAllCheckBox(ev) {
    this.listHouse.forEach((x) => (x.checked = ev.target.checked));
    this.changeModel();
  }

  changeModel() {
    const selectedHouse = [...this.listHouse]
      .filter((house) => house.checked)
      .map((p) => p.id);
    if (selectedHouse.length > 0) {
      this.isDelete = false;
    } else {
      this.isDelete = true;
    }
  }

  deleteHouse() {
    this.houseService.deleteHouse(this.id).subscribe(() => {
      this.houseService.getAllHouse().subscribe(listHouse => {
        this.listHouse = listHouse;
      });
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

  getAllHouse() {
    this.houseService.getAllHouse().subscribe(listHouse => {
      this.listHouse = listHouse;
      this.listFilterResult = this.listHouse;
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

  deleteListHouse() {
    for (var i = 0; i < this.listHouse.length; i++) {
      if (this.listHouse[i].checked === true) {
        this.listDelete.push(this.listHouse[i].id);
      }
    }
    this.houseService.deleteListHouse(this.listDelete).subscribe(res => {
        this.getAllHouse();
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
        this.listDelete = [];
        this.isDelete = true;
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
    this.getAllHouse();
  }

  changeStatus(event: any) {
    let list = [];
    // tslint:disable-next-line: radix
    switch (parseInt(event)) {
      case -1:
        this.listHouse = [...this.listFilterResult];
        break;
      case 1:
        list = [...this.listFilterResult];
        this.listHouse = list.filter(item => item.status === true);
        break;
      case 0:
        list = [...this.listFilterResult];
        this.listHouse = list.filter(item => item.status === false);
        break;
      default:
        break;
    }
  }
}
