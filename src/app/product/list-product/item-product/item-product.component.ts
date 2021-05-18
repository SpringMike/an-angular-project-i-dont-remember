import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {ModalDirective} from 'ngx-bootstrap/modal';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ModalDismissReasons, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {HouseService} from '../../../service/house/house.service';
import {CategoryService} from '../../../service/category/category.service';
import {Category} from '../../../model/category';
import {UtilitieService} from '../../../service/utilitie/utilitie.service';
import {Utilitie} from '../../../model/utilitie';
import {AuthenticationService} from '../../../service/auth/authentication.service';
import {UserToken} from '../../../model/user-token';
import {House} from '../../../model/house';
import * as firebase from 'firebase';

declare const myTest: any;
declare var $: any;
declare var Swal: any;

@Component({
  selector: 'app-item-product',
  templateUrl: './item-product.component.html',
  styleUrls: ['./item-product.component.scss']
})
export class ItemProductComponent implements OnInit {
  @ViewChild('content', {static: false}) public childModal!: ModalDirective;
  @Input() listHouse: Array<any>;
  @Output() eventEmit: EventEmitter<any> = new EventEmitter<any>();
  closeResult: string;
  checkButton = false;
  modalReference!: any;
  isAdd = false;
  isEdit = false;
  isInfo = false;
  title = '';
  type: any;
  status;
  listCategory: Category[];
  listUtilitie: Utilitie[];
  listUtilitieAddToHouse: any[] = [];
  myItems: File[] = [];
  arrayPicture: any[] = [];
  urlPicture: any[] = [];
  isLoading = false;
  idUser: any;
  page = 1;
  pageSize = 2;
  pageImage = 1;
  pageSizeImage = 4;
  model: any;
  submitted = false;
  arrCheck = [];
  formGroup: FormGroup;
  formName = 'HomeStay';
  imageObject: Array<object> = [];

  currentUser: UserToken;
  hasRoleUser = false;
  hasRoleAdmin = false;

  constructor(private modalService: NgbModal,
              private fb: FormBuilder,
              private  houseService: HouseService,
              private categoryService: CategoryService,
              private  utilitieService: UtilitieService,
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
        this.title = `Xác nhận thông tin ${this.formName}`;
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
    this.getAllCategory();
    this.getAllUtilitie();
    this.idUser = JSON.parse(localStorage.getItem('user') || '{id}').id;
  }

  view(model: any, type = null): void {
    this.arrCheck = this.listHouse;
    this.open(this.childModal);
    this.type = type;
    this.model = model;
    this.submitted = false;
    this.updateFormType(type);
    if (model.id === null || model.id === undefined) {
      this.formGroup = this.fb.group({
        name: [{value: null, disabled: this.isInfo}, [Validators.required]],
        address: [{value: null, disabled: this.isInfo}, [Validators.required]],
        description: [{value: null, disabled: this.isInfo}, [Validators.required]],
        numberRoom: [{value: null, disabled: this.isInfo}, [Validators.required]],
        price: [{value: null, disabled: this.isInfo}, [Validators.required]],
        category: [{value: null, disabled: this.isInfo}, [Validators.required]],
        utilitie: [{value: null, disabled: this.isInfo}, [Validators.required]],
        discount: [{value: null, disabled: this.isInfo}, [Validators.required]],
        status: [{value: false, disabled: true}],
      });
    } else {
      this.listUtilitieAddToHouse = this.model.utilitie;
      this.urlPicture = this.model.images;
      for (var i = 0; i < this.urlPicture.length; i++) {
        this.imageObject[i] = {
          image: this.urlPicture[i].link,
          thumbImage: this.urlPicture[i].link
        };
      }
      this.formGroup = this.fb.group({
        name: [{value: this.model.name, disabled: true}, [Validators.required]],
        address: [{value: this.model.address, disabled: true}, [Validators.required]],
        description: [{value: this.model.description, disabled: true}, [Validators.required]],
        numberRoom: [{value: this.model.numberRoom, disabled: true}, [Validators.required]],
        price: [{value: this.model.price, disabled: true}, [Validators.required]],
        category: [{value: this.model.category.id, disabled: true}, [Validators.required]],
        utilitie: [{value: this.model.utilitie, disabled: true}, [Validators.required]],
        discount: [{value: this.model.discount, disabled: true}, [Validators.required]],
        status: [{value: this.model.status, disabled: this.isInfo}]
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
    let house: any;
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
      house = {
        name: this.formGroup.get('name').value,
        address: this.formGroup.get('address').value,
        description: this.formGroup.get('description').value,
        numberRoom: this.formGroup.get('numberRoom').value,
        status: this.formGroup.get('status').value,
        price: this.formGroup.get('price').value,
        discount: this.formGroup.get('discount').value,
        category: {
          id: this.formGroup.get('category').value
        },
        utilitie: this.listUtilitieAddToHouse,
        user: {
          id: this.idUser
        },
        id: this.model.id,
        images: this.urlPicture
      };
    } else {
      house = {
        name: this.formGroup.get('name').value,
        address: this.formGroup.get('address').value,
        description: this.formGroup.get('description').value,
        numberRoom: this.formGroup.get('numberRoom').value,
        status: this.formGroup.get('status').value,
        price: this.formGroup.get('price').value,
        discount: this.formGroup.get('discount').value,
        category: {
          id: this.formGroup.get('category').value
        },
        utilitie: this.listUtilitieAddToHouse,
        user: {
          id: this.idUser
        },
        images: this.urlPicture
      };
    }
    if (this.isAdd) {
      console.log(house);
      this.houseService.createHouse(house).subscribe(res => {
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
      this.houseService.updateHouse(house.id, house).subscribe(res => {
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
          this.imageObject = [];
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
      this.listUtilitieAddToHouse = [];
      this.urlPicture = [];
      return 'by clicking on a backdrop';
    } else {
      this.listUtilitieAddToHouse = [];
      this.urlPicture = [];
      return `with: ${reason}`;
    }
  }

  public closeModalReloadData(): void {
    this.submitted = false;
    this.eventEmit.emit('success');
  }

  getAllCategory() {
    this.categoryService.getAllCategoryStatusTrue().subscribe(listCategory => {
      this.listCategory = listCategory;
    });
  }


  getAllUtilitie() {
    this.utilitieService.getAllUtilitieStatusTrue().subscribe(listUtilitie => {
      this.listUtilitie = listUtilitie;
    });
  }

  addUtilitieToHouse(id) {
    const utilitie1 = this.listUtilitie
      .filter((utilitie) => utilitie.id == id);

    const utilitie2 = this.listUtilitieAddToHouse
      .filter((utilitie) => utilitie1[0].id == utilitie.id);
    if (utilitie2.length == 0) {
      this.listUtilitieAddToHouse.push(utilitie1[0]);
    }
  }

  delete(id) {
    this.listUtilitieAddToHouse.splice(id, 1);
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
        this.arrayPicture = url;
        for (var i = 0; i < this.arrayPicture.length; i++) {
          this.urlPicture.push(this.arrayPicture[i]);
          this.imageObject[i] = {
            image: this.arrayPicture[i].link,
            thumbImage: this.arrayPicture[i].link
          };
        }
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
            const link = {link: downloadURL};
            // @ts-ignore
            resolve(link);
          });
        })
        .catch(error => reject(error));
    });
  }

  pushDeleteImage(i) {
    this.urlPicture.splice(i, 1);
  }

  onClick() {
    myTest();
  }
}
