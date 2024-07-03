import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddExistenciaproductComponent } from './add-existenciaproduct.component';

describe('AddExistenciaproductComponent', () => {
  let component: AddExistenciaproductComponent;
  let fixture: ComponentFixture<AddExistenciaproductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddExistenciaproductComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddExistenciaproductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
