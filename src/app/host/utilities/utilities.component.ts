import {Component, OnInit, ViewChild} from '@angular/core';
import {Utilitie} from '../../model/Utilitie';
import {UserToken} from '../../model/user-token';
import {UtilitieService} from '../../service/Utilitie/Utilitie.service';
import {AuthenticationService} from '../../service/auth/authentication.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ItemUtilitiesComponent} from '../../utilities/item-utilities/item-utilities.component';
import {UtilitiesItemComponent} from './utilities-item/utilities-item.component';
import {Category} from '../../model/category';

declare var $: any;
declare var Swal: any;

@Component({
  selector: 'app-utilities',
  templateUrl: './utilities.component.html',
  styleUrls: ['./utilities.component.scss']
})
export class UtilitiesComponent implements OnInit {
  // @ts-ignore
  @ViewChild(UtilitiesItemComponent) view!: UtilitiesItemComponent;
  listUtilitie: Utilitie[];
  currentUser: UserToken;
  hasRoleUser = false;
  hasRoleAdmin = false;
  id: number;
  isDelete = true;
  listDelete: number[] = [];
  listFilterResult: Category[] = [];
  isSelected = true;

  constructor(private utilitieService: UtilitieService,
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
    this.getAllUtilitie();
  }

  getUtilitieId(id: number) {
    this.id = id;
  }

  initModal(model: any, type = null): void {
    this.view.view(model, type);
  }

  checkAllCheckBox(ev) {
    this.listUtilitie.forEach((x) => (x.checked = ev.target.checked));
    this.changeModel();
  }

  changeModel() {
    const selectedUtilitie = [...this.listUtilitie]
      .filter((utilitie) => utilitie.checked)
      .map((p) => p.id);
    if (selectedUtilitie.length > 0) {
      this.isDelete = false;
    } else {
      this.isDelete = true;
    }
  }

  deleteUtilitie() {
    this.utilitieService.deleteUtilitie(this.id).subscribe(() => {
      this.utilitieService.getAllUtilitie().subscribe(listUtilitie => {
        this.listUtilitie = listUtilitie;
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

  getAllUtilitie() {
    this.utilitieService.getAllUtilitie().subscribe(listUtilitie => {
      this.listUtilitie = listUtilitie;
      this.listFilterResult = this.listUtilitie;
      $(function() {
        $('#modal-delete-list').modal('hide');
      });
      $(function() {
        $('#table-utilitie').DataTable({
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

  deleteListUtilitie() {
    for (var i = 0; i < this.listUtilitie.length; i++) {
      if (this.listUtilitie[i].checked === true) {
        this.listDelete.push(this.listUtilitie[i].id);
      }
    }
    this.utilitieService.deleteListUtilitie(this.listDelete).subscribe(res => {
        this.getAllUtilitie();
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
    this.getAllUtilitie();
  }

  changeStatus(event: any) {
    let list = [];
    // tslint:disable-next-line: radix
    switch (parseInt(event)) {
      case -1:
        this.listUtilitie = [...this.listFilterResult];
        break;
      case 1:
        list = [...this.listFilterResult];
        this.listUtilitie = list.filter(item => item.status === true);
        break;
      case 0:
        list = [...this.listFilterResult];
        this.listUtilitie = list.filter(item => item.status === false);
        break;
      default:
        break;
    }
  }
}
