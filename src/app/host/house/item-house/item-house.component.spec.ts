import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemHouseComponent } from './item-house.component';

describe('ItemHouseComponent', () => {
  let component: ItemHouseComponent;
  let fixture: ComponentFixture<ItemHouseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemHouseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemHouseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
