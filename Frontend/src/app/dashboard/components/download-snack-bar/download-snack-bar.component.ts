import { Component, inject, input, Input, signal } from '@angular/core';
import { MatSnackBarRef } from '@angular/material/snack-bar';
import { sharedImports } from '@shared/shared.imports';

@Component({
  selector: 'app-download-snack-bar',
  standalone: true,
  imports: [...sharedImports],
  templateUrl: './download-snack-bar.component.html',
  styleUrl: './download-snack-bar.component.scss'
})
export class DownloadSnackBarComponent {
  
  private snackBarRef = inject(MatSnackBarRef<DownloadSnackBarComponent>)

  progressDownload = signal(0)
  downloadingText = signal('Downloading...')

  constructor() {}

  closeSnackBar() {
    this.snackBarRef.dismiss();
  }
}
