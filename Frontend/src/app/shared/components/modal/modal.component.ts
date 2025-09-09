import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { sharedImports } from '@shared/shared.imports';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [...sharedImports],
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent {
  constructor(
    private dialogRef: MatDialogRef<ModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
    ) {}

  closeDialog() {
    this.dialogRef.close();
  }

  confirm() {
    this.dialogRef.close({ confirmed: true, additionalData: 'por si quieres pasar data a futuro' });
  }
}
