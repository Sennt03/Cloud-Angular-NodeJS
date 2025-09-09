import { Component, Input } from '@angular/core';
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
  @Input() isFile: boolean = false
  @Input() path!: string
  @Input() name!: string
  @Input() maskLoad: any

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
      panelClass: ['white-snack-bar'],
      data: { progressDownload: this.progressDownload, downloadingText: 'Downloading...' }
    });

    const pathDownload = this.path + '/' + this.name;
    
    this.cloudService.downloadFile(pathDownload).subscribe({
      next: (state) => {
        // Actualiza el progreso
        this.progressDownload = state.progress;
        
        // Accede al componente SnackBar y actualiza sus valores
        const snackBarInstance = snackBarRef.instance as any;
        snackBarInstance.progressDownload = this.progressDownload;
        
        if (state.file) {
          const blob = new Blob([state.file]);
          saveAs(blob, this.name);
          // Accede al componente SnackBar y actualiza sus valores
          snackBarInstance.downloadingText = 'Downloaded';
          setTimeout(() => {
            snackBarRef.dismiss();
          }, 3000);
        }
      },
      error: (err) => {
        alert('Error downloading file, please report.');
      },
      complete: () => {
        this.progressDownload = 0;
      }
    });
  }

  deleteFile(){
    const pathDelete = this.path + '/' + this.name;

    const dialogRef = this.dialog.open(ModalComponent, {
      width: '250px',
      data: {
        title: 'Delete',
        message: `Confirm deleting "${this.name}"`
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result?.confirmed) {
        toastr.setOption('timeOut', '0')
        toastr.info(`Deleting...`, '')
        this.maskLoad.set(true)
        this.cloudService.deleteFile(pathDelete).subscribe({
          next: (res) => {
            this.maskLoad.set(false)
            toastr.setDefaultsOptions()
            toastr.clear()
            toastr.success(res.message, '')
            this.dashBoardService.reloadDashboard(true)
          },
          error: () => {
            this.maskLoad.set(false)
            toastr.clear()
            toastr.error('Error unexpected', '')
          },
        })
      }
    });

  }
}
