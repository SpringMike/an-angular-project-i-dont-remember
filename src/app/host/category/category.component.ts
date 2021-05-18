import {Component, OnInit, ViewChild} from '@angular/core';
import {Category} from '../../model/category';
import {UserToken} from '../../model/user-token';
import {CategoryService} from '../../service/category/category.service';
import {AuthenticationService} from '../../service/auth/authentication.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {CategoryItemComponent} from './category-item/category-item.component';

declare var $: any;
declare var Swal: any;

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {
  // @ts-ignore
  @ViewChild(CategoryItemComponent) view!: CategoryItemComponent;
  listCategory: Category[];
  currentUser: UserToken;
  hasRoleUser = false;
  hasRoleAdmin = false;
  isDelete = true;
  id: number;
  listDelete: number[] = [];
  listFilterResult: Category[] = [];
  isSelected = true;

  constructor(private categoryService: CategoryService,
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
    this.getAllCategory();
  }

  getCategoryId(id: number) {
    this.id = id;
  }

  initModal(model: any, type = null): void {
    this.view.view(model, type);
  }

  checkAllCheckBox(ev) {
    this.listCategory.forEach((x) => (x.checked = ev.target.checked));
    this.changeModel();
  }

  changeModel() {
    const selectedCategory = [...this.listCategory]
      .filter((category) => category.checked)
      .map((p) => p.id);
    if (selectedCategory.length > 0) {
      this.isDelete = false;
    } else {
      this.isDelete = true;
    }
  }

  deleteCategory() {
    this.categoryService.deleteCategory(this.id).subscribe(() => {
      this.categoryService.getAllCategory().subscribe(listCategory => {
        this.listCategory = listCategory;
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

  getAllCategory() {
    this.categoryService.getAllCategory().subscribe(listCategory => {
      this.listCategory = listCategory;
      this.listFilterResult = this.listCategory;
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

  deleteListCategory() {
    for (var i = 0; i < this.listCategory.length; i++) {
      if (this.listCategory[i].checked === true) {
        this.listDelete.push(this.listCategory[i].id);
      }
    }
    this.categoryService.deleteListCategory(this.listDelete).subscribe(res => {
        this.getAllCategory();
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
    this.getAllCategory();
  }

  changeStatus(event: any) {
    let list = [];
    // tslint:disable-next-line: radix
    switch (parseInt(event)) {
      case -1:
        this.listCategory = [...this.listFilterResult];
        break;
      case 1:
        list = [...this.listFilterResult];
        this.listCategory = list.filter(item => item.status === true);
        break;
      case 0:
        list = [...this.listFilterResult];
        this.listCategory = list.filter(item => item.status === false);
        break;
      default:
        break;
    }
  }
}
