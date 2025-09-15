import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { sharedImports } from '@shared/shared.imports';
import toastr from '@shared/utils/toastr';

@Component({
  selector: 'app-modal-folder',
  standalone: true,
  imports: [...sharedImports, FormsModule],
  templateUrl: './modal-folder.component.html',
  styleUrl: './modal-folder.component.scss'
})
export class ModalFolderComponent {
  constructor(
    public dialogRef: MatDialogRef<ModalFolderComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {name: string}
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
