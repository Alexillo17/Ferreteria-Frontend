import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEitEmpleadoComponent } from './add-edit-empleado.component';

describe('AddEitEmpleadoComponent', () => {
  let component: AddEitEmpleadoComponent;
  let fixture: ComponentFixture<AddEitEmpleadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEitEmpleadoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEitEmpleadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
