import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemUtilitiesComponent } from './item-utilities.component';

describe('ItemUtilitiesComponent', () => {
  let component: ItemUtilitiesComponent;
  let fixture: ComponentFixture<ItemUtilitiesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemUtilitiesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemUtilitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
