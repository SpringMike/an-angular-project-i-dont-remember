import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemBillComponent } from './item-bill.component';

describe('ItemBillComponent', () => {
  let component: ItemBillComponent;
  let fixture: ComponentFixture<ItemBillComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemBillComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemBillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
