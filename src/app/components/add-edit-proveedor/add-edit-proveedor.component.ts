import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ModalCompletadoComponent } from '../modal-completado/modal-completado.component';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Proveedor } from 'src/app/interfaces/proveedor';
import { ProveedorService } from 'src/app/service/proveedor.service';

@Component({
  selector: 'app-add-edit-proveedor',
  templateUrl: './add-edit-proveedor.component.html',
  styleUrls: ['./add-edit-proveedor.component.scss']
})
export class AddEditProveedorComponent {

  form: FormGroup;
  inputdata: any;
  editdata: any;
  IDPROVEEDOR: number;
  Titulo: string = 'Agregar';
  Accion: string = 'Agregar';
  idExistente: boolean = false;
  cedulaExistente: boolean = false; 
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<AddEditProveedorComponent>,
    private fb: FormBuilder,
    private dialogRefModal: MatDialog,
    private _ProveedorService: ProveedorService
  ) {
    this.form = this.fb.group({
      Codigo: ['', [Validators.required], [this.validarIdExistente.bind(this)]],
      Nombre: ['', Validators.required],
      Apellido: ['', Validators.required],
      Correo: ['', Validators.required],
      Telefono: ['', Validators.required],
      Cedula: ['', [Validators.required], [this.validarCedula.bind(this)]],
      Estado: ['',Validators.required]
    })

    this.IDPROVEEDOR = data?.IDPROVEEDOR || 0;
  }

  ngOnInit(): void {
    this.inputdata = this.data;
    if (this.inputdata.IDPROVEEDOR > 0) {
      this.Titulo = 'Editar';
      this.Accion = 'Editar';
      this.MostrarProveedorporID(this.IDPROVEEDOR);
    } else {
      this.IDPROVEEDOR = 0;
    }
  }

  AddEditProveedor() {
    if (this.form.invalid || this.cedulaExistente) {
      console.error('Por favor complete los campos correctamente');
      return;
    }

    const proveedor: Proveedor = {
      IDPROVEEDOR: this.form.value.Codigo,
      Nombre: this.form.value.Nombre,
      Apellido: this.form.value.Apellido,
      Correo: this.form.value.Correo,
      Telefono: this.form.value.Telefono,
      Cedula: this.form.value.Cedula,
      Estado: this.form.value.Estado
    };
   

    const jsonProveedor = JSON.stringify(proveedor);
    console.log('Datos del proveedor', jsonProveedor);

    if (this.IDPROVEEDOR !== 0) {
      this._ProveedorService.updateProveedor(this.IDPROVEEDOR, proveedor).subscribe(() => {
        console.log('Se actualizó el proveedor');
        this.OpenEditProveedor();
      });
    } else {
      this._ProveedorService.saveproveedor(proveedor).subscribe(() => {
        console.log('Proveedor Agregado');
        this.OpenAddProveedor();
      });
    }
  }

  CloseAddEditProveedor() {
    this.dialogRef.close();
  }

  OpenAddProveedor(): void {
    this.dialogRefModal.open(ModalCompletadoComponent, {
      data: {
        TituloModalAccion: 'agregado',
        TituloModal: 'Proveedor',
      }
    }).afterClosed().subscribe(() => {
      this.CloseAddEditProveedor();
    });
  }

  OpenEditProveedor(): void {
    this.dialogRefModal.open(ModalCompletadoComponent, {
      data: {
        TituloModalAccion: 'editado',
        TituloModal: 'Proveedor',
      }
    }).afterClosed().subscribe(() => {
      this.CloseAddEditProveedor();
    });
  }

  MostrarProveedorporID(IDPROVEEDOR: number) {
    this._ProveedorService.getProveedorbyID(IDPROVEEDOR).subscribe((proveedor_result: Proveedor) => {
      this.editdata = proveedor_result;
      console.log(this.editdata);
      this.form.setValue({
        Codigo: this.editdata.IDPROVEEDOR,
        Nombre: this.editdata.Nombre,
        Apellido: this.editdata.Apellido,
        Correo: this.editdata.Correo,
        Telefono: this.editdata.Telefono,
        Cedula: this.editdata.Cedula,
        Estado: this.editdata.Estado
      });
    });
  }

  validarCedula(control: AbstractControl): Promise<ValidationErrors | null> {
    const cedula = control.value;
    if (!cedula) {
      return Promise.resolve(null);
    }
    return new Promise((resolve, reject) => {
      const cedulaValida = /^[0-9]{3}-[0-9]{6}-[0-9]{4}[A-Z]$/.test(cedula);
      if (!cedulaValida) {
        resolve({ cedulaInvalida: true });
      } else {
        this._ProveedorService.getProveedorbyCedula(cedula).subscribe((proveedor: Proveedor) => {
          if (proveedor && proveedor.IDPROVEEDOR !== this.IDPROVEEDOR) {
            this.cedulaExistente = true;
            resolve({ cedulaExistente: true });
          } else {
            this.cedulaExistente = false;
            resolve(null);
          }
        }, (error) => {
          console.error("Error al buscar proveedor por cédula", error);
          reject({ cedulaInvalida: true });
        });
      }
    });
}

validarIdExistente(control: FormControl): Promise<ValidationErrors | null> {
  const id = control.value;
  if (!id) {
    return Promise.resolve(null);
  }
  return new Promise((resolve, reject) => {
    this._ProveedorService.getProveedorbyID(id).subscribe((proveedor: Proveedor) => {
      if (proveedor && proveedor.IDPROVEEDOR !== this.IDPROVEEDOR) {
        this.idExistente = true;
        resolve({ idExistente: true });
      } else {
        this.idExistente = false;
        resolve(null);
      }
    }, (error) => {
      console.error("Error al buscar proveedor por ID", error);
      reject({ idInvalido: true });
    });
  });
}


}
