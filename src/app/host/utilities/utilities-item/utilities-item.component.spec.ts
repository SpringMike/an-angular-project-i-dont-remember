import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UtilitiesItemComponent } from './utilities-item.component';

describe('UtilitiesItemComponent', () => {
  let component: UtilitiesItemComponent;
  let fixture: ComponentFixture<UtilitiesItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UtilitiesItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UtilitiesItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
