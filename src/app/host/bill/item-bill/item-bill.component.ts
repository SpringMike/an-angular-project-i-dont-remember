import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {ModalDirective} from 'ngx-bootstrap/modal';
import {UserToken} from '../../../model/user-token';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ModalDismissReasons, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {CategoryService} from '../../../service/category/category.service';
import {AuthenticationService} from '../../../service/auth/authentication.service';
import {BillService} from '../../../service/bill/bill.service';

declare var $: any;
declare var Swal: any;

@Component({
  selector: 'app-item-bill',
  templateUrl: './item-bill.component.html',
  styleUrls: ['./item-bill.component.scss']
})
export class ItemBillComponent implements OnInit {
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
  hasRoleUser = false;
  hasRoleAdmin = false;
  listService: any[] = [];
  page = 1;
  pageSize = 2;
  model: any;
  submitted = false;
  idHouse: number;
  arrCheck = [];
  formGroup: FormGroup;
  formName = 'Đơn đặt HomeStay';

  constructor(private modalService: NgbModal,
              private fb: FormBuilder,
              private billService: BillService,
              private  categoryService: CategoryService,
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
        this.title = `Xem thông tin chi tiết ${this.formName}`;
        break;
      case 'edit':
        this.isInfo = false;
        this.isEdit = true;
        this.isAdd = false;
        this.title = `Xác nhận đơn đặt ${this.formName}`;
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
  }

  view(model: any, type = null): void {
    this.listService = model.service;
    this.idHouse = model.houseBill.id;
    this.arrCheck = this.listcategorys;
    this.open(this.childModal);
    this.type = type;
    this.model = model;
    this.submitted = false;
    this.updateFormType(type);
    if (model.id === null || model.id === undefined) {
      this.formGroup = this.fb.group({
        nameUser: [{value: null, disabled: this.isInfo}, [Validators.required]],
        telephoneNumber: [{value: null, disabled: this.isInfo}, [Validators.required]],
        bookingDate: [{value: null, disabled: this.isInfo}, [Validators.required]],
        startDate: [{value: null, disabled: this.isInfo}, [Validators.required]],
        endDate: [{value: null, disabled: this.isInfo}, [Validators.required]],
        email: [{value: null, disabled: this.isInfo}, [Validators.required]],
        totalPrice: [{value: null, disabled: this.isInfo}, [Validators.required]],
        status: [{value: false, disabled: true}],
      });
    } else {
      this.formGroup = this.fb.group({
        nameUser: [{value: this.model.nameUser, disabled: true}, [Validators.required]],
        telephoneNumber: [{value: this.model.telephoneNumber, disabled: true}, [Validators.required]],
        bookingDate: [{value: this.model.bookingDate, disabled: true}, [Validators.required]],
        startDate: [{value: this.model.startDate, disabled: true}, [Validators.required]],
        endDate: [{value: this.model.endDate, disabled: true}, [Validators.required]],
        email: [{value: this.model.email, disabled: true}, [Validators.required]],
        totalPrice: [{value: this.model.totalPrice, disabled: true}, [Validators.required]],
        status: [{value: this.model.status, disabled: this.isInfo}],
      });
    }
  }

  // tslint:disable-next-line:typedef
  open(content: any) {
    this.modalReference = this.modalService.open(content, {
      ariaLabelledBy: 'modal-basic-title',
      centered: true,
      size: 'xl',
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

  save() {
    let bill: any;
    this.submitted = true;
    if (this.formGroup.invalid) {
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
      bill = {
        nameUser: this.formGroup.get('nameUser').value,
        telephoneNumber: this.formGroup.get('telephoneNumber').value,
        bookingDate: this.formGroup.get('bookingDate').value,
        startDate: this.formGroup.get('startDate').value,
        endDate: this.formGroup.get('endDate').value,
        email: this.formGroup.get('email').value,
        totalPrice: this.formGroup.get('totalPrice').value,
        id: this.model.id,
        houseBill: {id: this.idHouse}
      };
    } else {
      bill = {
        name: this.formGroup.get('name').value,
        status: this.formGroup.get('status').value,
      };
    }
    if (this.isAdd) {
      this.categoryService.createCategory(bill).subscribe(res => {
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
      if (this.model.status == 'Chờ chủ nhà xác nhận') {
        this.billService.confirmBillByHost(bill).subscribe(res => {
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
      } else {
        $(function() {
          const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000
          });

          Toast.fire({
            type: 'error',
            title: 'Chủ nhà không có quyển xác nhận đơn đặt này'
          });
        });
        this.modalReference.dismiss();
      }
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


}
