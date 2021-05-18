import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {ModalDirective} from 'ngx-bootstrap/modal';
import {UserToken} from '../../../model/user-token';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ModalDismissReasons, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {AuthenticationService} from '../../../service/auth/authentication.service';
import {UserService} from '../../../service/user/user.service';
import {User} from '../../../model/user';
import {House} from '../../../model/house';
import * as firebase from 'firebase';
import {environment} from '../../../../environments/environment';

declare var $: any;
declare var Swal: any;
declare const myTest: any;

@Component({
  selector: 'app-user-item',
  templateUrl: './user-item.component.html',
  styleUrls: ['./user-item.component.scss']
})
export class UserItemComponent implements OnInit {

  @ViewChild('content', {static: false}) public childModal!: ModalDirective;
  @Input() listcategorys: Array<any>;
  @Output() eventEmit: EventEmitter<any> = new EventEmitter<any>();
  closeResult: string;
  checkButton = false;
  modalReference!: any;
  isAdd = false;
  isEdit = false;
  isInfo = false;
  title = '';
  type: any;
  currentUser: UserToken;
  user: User;
  isLoading = false;
  myItems: File[] = [];
  hasRoleUser = false;
  hasRoleAdmin = false;
  picture: any;
  avt: any;
  model: any;
  submitted = false;
  arrCheck = [];
  form: FormGroup;
  formName = 'cá nhân';

  constructor(private modalService: NgbModal,
              private fb: FormBuilder,
              private userService: UserService,
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

  updateFormType(type: any) {
    switch (type) {
      case 'add':
        this.isInfo = false;
        this.isEdit = false;
        this.isAdd = true;
        this.title = `Thêm mới thông tin ${this.formName}`;
        break;
      case 'show':
        this.isInfo = true;
        this.isEdit = false;
        this.isAdd = false;
        this.title = `Xem chi tiết thông tin ${this.formName}`;
        break;
      case 'edit':
        this.isInfo = false;
        this.isEdit = true;
        this.isAdd = false;
        this.title = `Chỉnh sửa thông tin ${this.formName}`;
        break;
      default:
        this.isInfo = false;
        this.isEdit = false;
        this.isAdd = true;
        break;
    }
  }

  ngOnInit(): void {
    this.submitted = false;
    if (this.currentUser != null) {
      this.getUser();
    }
  }

  view(model: any, type = null): void {
    this.arrCheck = this.listcategorys;
    this.open(this.childModal);
    this.type = type;
    this.model = model;
    this.submitted = false;
    this.updateFormType(type);
    if (model.id === null || model.id === undefined) {
      this.form = this.fb.group({
        email: [{value: null, disabled: this.isInfo}, [Validators.required]],
        fullName: [{value: null, disabled: this.isInfo}, [Validators.required]],
        telephoneNumber: [{value: null, disabled: this.isInfo}, [Validators.required]],
        avt: [{value: null, disabled: this.isInfo}, [Validators.required]],
      });
    } else {
      this.form = this.fb.group({
        email: [{value: this.user.email, disabled: this.isInfo}, [Validators.required]],
        fullName: [{value: this.user.fullName, disabled: this.isInfo}, [Validators.required]],
        telephoneNumber: [{value: this.user.telephoneNumber, disabled: this.isInfo}, [Validators.required]],
      });
    }
  }

  // tslint:disable-next-line:typedef
  open(content: any) {
    this.modalReference = this.modalService.open(content, {
      ariaLabelledBy: 'modal-basic-title',
      centered: true,
      size: 'lg',
    });
    this.modalReference.result.then(
      (result: any) => {
        this.closeResult = `Closed with: ${result}`;
      },
      (reason: any) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      }
    );
  }

  getUser() {
    this.userService.getUser(this.currentUser.id).subscribe(user => {
      this.user = user;
    });
  }

  save() {
    let user: any;
    this.submitted = true;
    if (this.form.invalid) {
      $(function() {
        const Toast = Swal.mixin({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000
        });

        Toast.fire({
          type: 'error',
          title: 'Kiểm tra thông tin các trường đã nhập'
        });
      });
      return;
    }
    if (this.isEdit) {
      if (this.picture == null) {
        this.avt = this.user.avt;
      } else {
        this.avt = this.picture[0].avt;
      }
      user = {
        email: this.form.get('email').value,
        fullName: this.form.get('fullName').value,
        telephoneNumber: this.form.get('telephoneNumber').value,
        avt: this.avt,
        id: this.model.id,
      };
    } else {
      user = {
        name: this.form.get('name').value,
        status: this.form.get('status').value,
      };
    }
    if (this.isAdd) {
      this.userService.deleteUser(user).subscribe(res => {
          this.closeModalReloadData();
          $(function() {
            const Toast = Swal.mixin({
              toast: true,
              position: 'top-end',
              showConfirmButton: false,
              timer: 3000
            });

            Toast.fire({
              type: 'success',
              title: 'Thêm mới thành công'
            });
          });
          this.modalReference.dismiss();
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
              title: 'Thêm mới thất bại'
            });
          });
        });
    }
    if (this.isEdit) {
      console.log(user);
      this.userService.updateUser(user).subscribe(res => {
          this.closeModalReloadData();
          $(function() {
            const Toast = Swal.mixin({
              toast: true,
              position: 'top-end',
              showConfirmButton: false,
              timer: 3000
            });

            Toast.fire({
              type: 'success',
              title: 'Cập nhật thành công'
            });
          });
          this.getUser();
          this.modalReference.dismiss();
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
              title: 'Cập nhật thất bại'
            });
          });
        });
    }
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  public closeModalReloadData(): void {
    this.submitted = false;
    this.eventEmit.emit('success');
  }

  // Upload avt
  uploadFile(event) {
    this.myItems = [];
    const files = event.target.files;
    for (let i = 0; i < files.length; i++) {
      this.myItems.push(files[i]);
    }
    this.uploadAll();
  }

  uploadAll() {
    this.isLoading = true;
    Promise.all(
      this.myItems.map(file => this.putStorageItem(file))
    )
      .then((url) => {
        console.log(`All success`, url);
        this.picture = url;
        this.user.avt = this.picture[0].avt;
        this.isLoading = false;
      })
      .catch((error) => {
        console.log(`Some failed: `, error.message);
        this.isLoading = false;
      });
  }

  putStorageItem(file): Promise<House> {
    // the return value will be a Promise
    const metadata = {
      contentType: 'image/jpeg',
    };
    return new Promise<House>((resolve, reject) => {
      firebase.storage().ref('img/' + Date.now()).put(file, metadata)
        .then(snapshot => {
          snapshot.ref.getDownloadURL().then(downloadURL => {
            const link = {avt: downloadURL};
            // @ts-ignore
            resolve(link);
          });
        })
        .catch(error => reject(error));
    });
  }

  onClick() {
    myTest();
  }

}
