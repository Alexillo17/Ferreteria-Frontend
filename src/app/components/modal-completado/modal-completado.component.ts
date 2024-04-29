import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-modal-completado',
  templateUrl: './modal-completado.component.html',
  styleUrls: ['./modal-completado.component.scss']
})
export class ModalCompletadoComponent {

Titulo: any

constructor(
  @Inject(MAT_DIALOG_DATA) public data: any
)
{
this.Titulo = this.data
}


}
