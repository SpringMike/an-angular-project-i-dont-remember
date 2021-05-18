import {Component, OnInit} from '@angular/core';
import {User} from '../../model/User';
import {UserToken} from '../../model/user-token';
import {AuthenticationService} from '../../service/auth/authentication.service';
import {UserService} from '../../service/user/user.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

declare var $: any;
declare var Swal: any;

@Component({
  selector: 'app-listuser',
  templateUrl: './listuser.component.html',
  styleUrls: ['./listuser.component.scss']
})
export class ListuserComponent implements OnInit {
  listUser: User[];
  currentUser: UserToken;
  hasRoleUser = false;
  hasRoleAdmin = false;
  isDelete = true;
  id: number;
  listFilterResult: User[] = [];
  listDelete: number[] = [];
  isSelected = true;

  constructor(private userService: UserService,
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
    this.getAllUser();
  }

  getUserId(id: number) {
    this.id = id;
  }
  deleteUser() {
    this.userService.deleteUser(this.id).subscribe(() => {
      this.userService.getAllUser().subscribe(listUser => {
        this.listUser = listUser;
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

  getAllUser() {
    this.userService.getAllUser().subscribe(listUser => {
      this.listUser = listUser;
      this.listFilterResult = this.listUser;
      $(function() {
        $('#table-user').DataTable({
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

  changeStatus(event: any) {
    let list = [];
    // tslint:disable-next-line: radix
    switch (parseInt(event)) {
      case -1:
        this.listUser = [...this.listFilterResult];
        break;
      case 1:
        list = [...this.listFilterResult];
        this.listUser = list.filter(item => item.roles[0].name === 'ROLE_ADMIN');
        break;
      case 0:
        list = [...this.listFilterResult];
        this.listUser = list.filter(item => item.roles[0].name === 'ROLE_USER');
        break;
      default:
        break;
    }
  }
}
