import { Component, Input } from '@angular/core';
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
  @Input() progressDownload!: number;
  @Input() downloadingText: string = 'Downloading...';

  constructor(private snackBarRef: MatSnackBarRef<DownloadSnackBarComponent>) {}

  closeSnackBar() {
    this.snackBarRef.dismiss();
  }
}
