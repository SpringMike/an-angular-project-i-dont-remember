import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemservicehouseComponent } from './itemservicehouse.component';

describe('ItemservicehouseComponent', () => {
  let component: ItemservicehouseComponent;
  let fixture: ComponentFixture<ItemservicehouseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemservicehouseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemservicehouseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
