import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-modal-alert',
  templateUrl: './modal-alert.component.html',
  styleUrls: ['./modal-alert.component.scss']
})
export class ModalAlertComponent {

  constructor(public dialog: MatDialogRef<ModalAlertComponent>,
    @Inject(MAT_DIALOG_DATA) public mensaje: string
  ){

  }

  CerrarDialog(): void{
    this.dialog.close(false);
    return
  }

  ConfirmarDialog(): void{
    this.dialog.close(true);
    return
  }

}
