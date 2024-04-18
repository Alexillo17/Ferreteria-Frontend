import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalCompletadoComponent } from './modal-completado.component';

describe('ModalCompletadoComponent', () => {
  let component: ModalCompletadoComponent;
  let fixture: ComponentFixture<ModalCompletadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalCompletadoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalCompletadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
