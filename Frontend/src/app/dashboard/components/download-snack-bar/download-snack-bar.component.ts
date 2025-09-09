import { Component } from '@angular/core';
import { sharedImports } from '@shared/shared.imports';

@Component({
  selector: 'app-download-snack-bar',
  standalone: true,
  imports: [...sharedImports],
  templateUrl: './download-snack-bar.component.html',
  styleUrl: './download-snack-bar.component.scss'
})
export class DownloadSnackBarComponent {

}
