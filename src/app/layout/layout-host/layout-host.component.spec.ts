import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LayoutHostComponent } from './layout-host.component';

describe('LayoutHostComponent', () => {
  let component: LayoutHostComponent;
  let fixture: ComponentFixture<LayoutHostComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LayoutHostComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LayoutHostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
