import { Component, input, Input, output, signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CloudService } from '@services/cloud.service';
import { DashboardService } from '@services/dashboard.service';
import { ModalComponent, sharedImports } from '@shared/shared.imports';
import toastr from '@shared/utils/toastr';
import { DownloadSnackBarComponent } from '../download-snack-bar/download-snack-bar.component';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-actions',
  standalone: true,
  imports: [...sharedImports],
  templateUrl: './actions.component.html',
  styleUrl: './actions.component.scss'
})
export class ActionsComponent {
  isFile = input(false)
  path = input('')
  name = input('')
  maskLoad = input(false)
  downloading = input(false)
  downloadEvent = output<boolean>()

  progressDownload = 0

  constructor(
    private cloudService: CloudService,
    private _snackBar: MatSnackBar,
    private dialog: MatDialog,
    private dashBoardService: DashboardService
  ){}

  download() {
    const snackBarRef = this._snackBar.openFromComponent(DownloadSnackBarComponent, {
      duration: 0,  // No se cierra automáticamente
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: ['white-snack-bar']
    });

    const pathDownload = this.path() + '/' + this.name();
    
    this.downloadEvent.emit(true)
    this.cloudService.downloadFile(pathDownload).subscribe({
      next: (state) => {
        this.progressDownload = state.progress;

        const snackBarInstance = snackBarRef.instance as any;
        snackBarInstance.progressDownload.set(this.progressDownload)
        
        if (state.file) {
          const blob = new Blob([state.file]);
          saveAs(blob, this.name());
          snackBarInstance.downloadingText.set('Downloaded')
          this.downloadEvent.emit(false)
          
          setTimeout(() => {
            snackBarRef.dismiss();
          }, 3000);
        }
      },
      error: (err) => {
        toastr.error('Error downloading file, please report.', '');
        this.downloadEvent.emit(false)
      },
      complete: () => {
        this.progressDownload = 0;
        this.downloadEvent.emit(false)
      }
    });
  }

  deleteFile(){
    const pathDelete = this.path() + '/' + this.name();

    const dialogRef = this.dialog.open(ModalComponent, {
      width: '250px',
      data: {
        title: 'Delete',
        message: `Confirm deleting "${this.name()}"`
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result?.confirmed) {
        toastr.setOption('timeOut', '0')
        toastr.info(`Deleting...`, '')
        this.cloudService.deleteFile(pathDelete).subscribe({
          next: (res) => {
            toastr.setDefaultsOptions()
            toastr.clear()
            toastr.success(res.message, '')
            this.dashBoardService.reloadDashboard(true)
          },
          error: () => {
            toastr.clear()
            toastr.error('Error unexpected', '')
          },
        })
      }
    });

  }
}
