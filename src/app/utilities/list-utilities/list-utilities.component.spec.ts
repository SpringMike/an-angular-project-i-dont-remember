import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListUtilitiesComponent } from './list-utilities.component';

describe('ListUtilitiesComponent', () => {
  let component: ListUtilitiesComponent;
  let fixture: ComponentFixture<ListUtilitiesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListUtilitiesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListUtilitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
