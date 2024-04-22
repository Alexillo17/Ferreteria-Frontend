import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListFacturaComponent } from './list-factura.component';

describe('ListFacturaComponent', () => {
  let component: ListFacturaComponent;
  let fixture: ComponentFixture<ListFacturaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListFacturaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListFacturaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
