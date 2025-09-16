import { CommonModule } from '@angular/common';
import { Component, inject, input, Signal, signal, ViewChild, WritableSignal } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatDialog } from '@angular/material/dialog';
import { MatExpansionPanel } from '@angular/material/expansion';
import { LsUploadFiles } from '@models/cloud.models';
import { CloudService } from '@services/cloud.service';
import { DashboardService } from '@services/dashboard.service';
import { sharedImports } from '@shared/shared.imports';
import toastr from '@shared/utils/toastr';
import { BottomSheetComponent } from './bottom-sheet/bottom-sheet.component';
import { InputModalComponent } from '@shared/components/input-modal/input-modal.component';

@Component({
  selector: 'app-upload',
  standalone: true,
  imports: [...sharedImports, CommonModule],
  templateUrl: './upload.component.html',
  styleUrl: './upload.component.scss'
})
export class UploadComponent {

  private _bottomSheet = inject(MatBottomSheet);
  public dialog = inject(MatDialog)
  private cloudService = inject(CloudService)
  private dashBoardService = inject(DashboardService)

  @ViewChild('expansionPanel', { static: true }) expansionPanel!: MatExpansionPanel;
  path = input<string>('')
  maskLoad = input(false)
  selectedOption: WritableSignal<string | null> = signal(null);

  panelOpenState = signal(false);
  progressUpload = signal<LsUploadFiles>({
    text: 'Uploading...',
    value: 0,
    loading: true,
    uploaded: []
  })

  constructor() {}

  openBottomSheet(): void {
    const ref = this._bottomSheet.open(BottomSheetComponent);

    ref.afterDismissed().subscribe((result) => {
      if (result) {
        this.selectedOption.set(result);
        if(result == 'folder'){
          this.newFolderModal()
        }else{
          document.getElementById('file')?.click()
        }
      }
    });
  }

  newFolderModal(){
    const dialogRef = this.dialog.open(InputModalComponent, {
      data: {
        name: '',
        textDesc: 'Create new folder',
        textTitle: 'Enter a folder name',
        textBtn: 'Create'
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result && result.trim() != ''){
        this.createFolder(result)
      }
    })
  }

  createFolder(name: any){
    if(name.trim().length > 35){
      toastr.error('File name max 35 letters', '')
      return
    }

    this.cloudService.createFolder(name.trim(), this.path()).subscribe({
      next: (res) => {
        toastr.success(res.message, 'Successful')
        this.dashBoardService.reloadDashboard(true)
      },
      error: (err) => {
        toastr.error(err.error.message, 'Error')
      }
    });
  }

  uploadFile($event: any){
    const files = $event.target.files
    this.progressUpload.set({
      loading: true,
      value: 0,
      text: 'Uploading...',
      uploaded: []
    })
    this.expansionPanel.close();

    document.getElementById('accordion-uploading')?.classList.add('show')
    this.cloudService.uploadFile(files, this.path()).subscribe({
      next: (res) => {
        if(!res?.event){
          this.progressUpload.update(val => ({...val, value: res.progress}))
        }else{
          this.progressUpload.update(val => ({
            ...val,
            uploaded: (res as any)?.event.responses,
            text: 'Finished',
            loading: false
          }))
          this.expansionPanel.open();
          this.dashBoardService.reloadDashboard(true)
          toastr.info('Process finished!', '')
        }
      },
      error: (err) => {
        toastr.error(err.error.message, 'Error uploading files')
      },
      complete: () => {
        const input:any = document.getElementById('file')
        input.value = ''
      }
    })


  }

  closeAccordion(){
    document.getElementById('accordion-uploading')?.classList.remove('show')
  }

}
