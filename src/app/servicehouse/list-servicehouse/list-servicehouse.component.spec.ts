import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListServicehouseComponent } from './list-servicehouse.component';

describe('ListServicehouseComponent', () => {
  let component: ListServicehouseComponent;
  let fixture: ComponentFixture<ListServicehouseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListServicehouseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListServicehouseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
