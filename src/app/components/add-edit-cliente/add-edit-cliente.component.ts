import { Component, Inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Cliente } from 'src/app/interfaces/cliente';
import { ApiService } from 'src/app/service/api.service';
import { ModalCompletadoComponent } from '../modal-completado/modal-completado.component';

@Component({
  selector: 'app-add-edit-cliente',
  templateUrl: './add-edit-cliente.component.html',
  styleUrls: ['./add-edit-cliente.component.scss']
})
export class AddEditClienteComponent {

  form: FormGroup
  inputdata: any
  editdata: any
  IDCLIENTE: number
  Titulo: string = 'Agregar';
  Accion: string = 'Agregar';
  cedulaExistente: boolean = false; 

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddEditClienteComponent>,
    private dialogRefModal: MatDialog,
    private _ClienteService: ApiService
  ){
    this.form = this.fb.group({
       Nombre: ['', Validators.required],
       Apellido: ['',Validators.required],
       Cedula: ['', [Validators.required], [this.validarCedula.bind(this)]],
    })
  
    this.IDCLIENTE = data?.IDCLIENTE || 0;

  }

  ngOnInit(): void{
    this.inputdata = this.data;
    if(this.inputdata.IDCLIENTE > 0){
      this.Titulo = 'Editar';
      this.Accion = 'Editar';
      this.MostrarClienteporID(this.IDCLIENTE);
    }
  }

  MostrarClienteporID(IDCLIENTE: number) {
    this._ClienteService.getClientebyID(IDCLIENTE).subscribe((cliente_result: Cliente) => {
      this.editdata = cliente_result;
      console.log(this.editdata);
      this.form.setValue({
        Nombre: this.editdata.Nombre,
        Apellido: this.editdata.Apellido,
        Cedula: this.editdata.Cedula,
      });
    });
  }

  AddEditCliente(){
    if(this.form.invalid || this.cedulaExistente){
      console.error('Por favor complete los campos')
      return
    }

    const cliente: Cliente = {
      Nombre: this.form.value.Nombre,
      Apellido: this.form.value.Apelido,
      Cedula: this.form.value.Cedula
    };

    const jsonCliente = JSON.stringify(cliente)

    if(this.IDCLIENTE !== 0){
      this._ClienteService.updateCliente(this.IDCLIENTE,cliente).subscribe(()=>{
        console.log('Se actualizo el cliente')
        this.OpenEditCliente();
      })
    }
    else{
      this._ClienteService.saveCliente(cliente).subscribe(()=>{
        console.log('Cliente Agergado');
        this.OpenAddCliente()
      });
    }
  }

  OpenAddCliente(): void {
    this.dialogRefModal.open(ModalCompletadoComponent, {
      data: {
        TituloModalAccion: 'agregado',
        TituloModal: 'Cliente',
      }
    }).afterClosed().subscribe(() => {
      this.CloseAddEditCliente();
    });
  }



  validarCedula(control: AbstractControl): Promise<ValidationErrors | null> {
    const cedula = control.value;
  
    if (!cedula) {
      return Promise.resolve(null);
    }
  
    const cedulaValida = /^[0-9]{3}-[0-9]{6}-[0-9]{4}[A-Z]$/.test(cedula);
  
    if (!cedulaValida) {
      return Promise.resolve({ cedulaInvalida: true });
    }
  
    return new Promise((resolve, reject) => {
      this._ClienteService.getClientebyCedula(cedula).subscribe(
        (cliente: Cliente) => {
          if (cliente && cliente.IDCLIENTE !== this.IDCLIENTE) {
            this.cedulaExistente = true;
            resolve({ cedulaExistente: true });
          } else {
            this.cedulaExistente = false;
            resolve(null); 
          }
        },
        (error) => {
          console.error("Error al buscar cliente por cédula", error);
          reject({ cedulaInvalida: true }); 
        }
      );
    });
  }

CloseAddEditCliente() {
  this.dialogRef.close();
}

OpenEditCliente(): void {
  this.dialogRefModal.open(ModalCompletadoComponent, {
    data: {
      TituloModalAccion: 'editado',
      TituloModal: 'Cliente',
    }
  }).afterClosed().subscribe(() => {
    this.CloseAddEditCliente()
  });
}



}
