import {Component, OnInit, ViewChild} from '@angular/core';
import {UserToken} from '../../model/user-token';
import {AuthenticationService} from '../../service/auth/authentication.service';
import {Service} from '../../model/service';
import {ServiceService} from '../../service/service/service.service';

import {ServiceItemComponent} from './service-item/service-item.component';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {Category} from '../../model/category';

declare var $: any;
declare var Swal: any;

@Component({
  selector: 'app-service',
  templateUrl: './service.component.html',
  styleUrls: ['./service.component.scss']
})
export class ServiceComponent implements OnInit {
  // @ts-ignore
  @ViewChild(ServiceItemComponent) view!: ServiceItemComponent;
  listService: Service[];
  currentUser: UserToken;
  hasRoleUser = false;
  hasRoleAdmin = false;
  id: number;
  isDelete = true;
  listDelete: number[] = [];
  listFilterResult: Category[] = [];
  isSelected = true;

  constructor(private serviceService: ServiceService, private modalService: NgbModal,
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
    this.getAllservice();
  }

  initModal(model: any, type = null): void {
    this.view.view(model, type);
  }

  checkAllCheckBox(ev) {
    this.listService.forEach((x) => (x.checked = ev.target.checked));
    this.changeModel();
  }

  changeModel() {
    const selectedservice = [...this.listService]
      .filter((service) => service.checked)
      .map((p) => p.id);
    if (selectedservice.length > 0) {
      this.isDelete = false;
    } else {
      this.isDelete = true;
    }
  }

  getserviceId(id: number) {
    this.id = id;
  }

  deleteservice() {
    this.serviceService.deleteService(this.id).subscribe(() => {
      this.serviceService.getAllService().subscribe(listService => {
        this.listService = listService;
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

  getAllservice() {
    this.serviceService.getAllService().subscribe(listService => {
      this.listService = listService;
      this.listFilterResult = this.listService;
      $(function() {
        $('#table-service').DataTable({
          'paging': true,
          'lengthChange': true,
          'searching': true,
          'retrieve': true,
          'ordering': false,
          'info': false,
          'autoWidth': true,
        });
      });
    });
  }

  changeStatus(event: any) {
    let list = [];
    // tslint:disable-next-line: radix
    switch (parseInt(event)) {
      case -1:
        this.listService = [...this.listFilterResult];
        break;
      case 1:
        list = [...this.listFilterResult];
        this.listService = list.filter(item => item.status === true);
        break;
      case 0:
        list = [...this.listFilterResult];
        this.listService = list.filter(item => item.status === false);
        break;
      default:
        break;
    }
  }

  deleteListService() {
    for (var i = 0; i < this.listService.length; i++) {
      if (this.listService[i].checked === true) {
        this.listDelete.push(this.listService[i].id);
      }
    }
    this.serviceService.deleteListService(this.listDelete).subscribe(res => {
        this.getAllservice();
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
    this.getAllservice();
  }
}
