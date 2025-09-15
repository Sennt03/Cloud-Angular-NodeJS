import { Component, Inject, input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { sharedImports } from '@shared/shared.imports';
import toastr from '@shared/utils/toastr';

@Component({
  selector: 'app-input-modal.component',
  standalone: true,
  imports: [...sharedImports, FormsModule],
  templateUrl: './input-modal.component.html',
  styleUrl: './input-modal.component.scss'
})
export class InputModalComponent {

  constructor(
    public dialogRef: MatDialogRef<InputModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
      name: string,
      textDesc: string,
      textTitle: string,
      textBtn: string,
      ext?: string
    }
  ) {}

  close(): void {
    this.dialogRef.close();
  }

  create(){
    if(!this.data.name.trim() || this.data.name.trim() == ''){
      toastr.error('Enter a name', '')
      this.data.name = ''
      return
    }

    document.getElementById('create')?.click()
  }

}
