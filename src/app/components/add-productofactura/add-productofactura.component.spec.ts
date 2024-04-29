import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddProductofacturaComponent } from './add-productofactura.component';

describe('AddProductofacturaComponent', () => {
  let component: AddProductofacturaComponent;
  let fixture: ComponentFixture<AddProductofacturaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddProductofacturaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddProductofacturaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
