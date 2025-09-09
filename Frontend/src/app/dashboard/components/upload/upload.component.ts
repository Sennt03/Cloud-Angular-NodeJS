import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatDialog } from '@angular/material/dialog';
import { MatExpansionPanel } from '@angular/material/expansion';
import { LsUploadFiles } from '@models/cloud.models';
import { CloudService } from '@services/cloud.service';
import { DashboardService } from '@services/dashboard.service';
import { sharedImports } from '@shared/shared.imports';
import toastr from '@shared/utils/toastr';
import { Subscription } from 'rxjs';
import { BottomSheetComponent } from './bottom-sheet/bottom-sheet.component';
import { ModalFolderComponent } from './modal-folder/modal-folder.component';

@Component({
  selector: 'app-upload',
  standalone: true,
  imports: [...sharedImports, CommonModule],
  templateUrl: './upload.component.html',
  styleUrl: './upload.component.scss'
})
export class UploadComponent {

  @ViewChild('expansionPanel', { static: true }) expansionPanel!: MatExpansionPanel;
  @Output() $newActionReload = new EventEmitter<boolean>()
  @Input() path!: string;
  @Input() maskLoad: any;
  $newFolder!: Subscription

  panelOpenState: boolean = false;
  progressUpload: LsUploadFiles = {
    text: 'Uploading...',
    value: 0,
    loading: true,
    uploaded: []
  }

  constructor(
    private _bottomSheet: MatBottomSheet,
    private cloudService: CloudService,
    public dialog: MatDialog,
    private dashBoardService: DashboardService
  ) {}

  ngOnInit(): void {
    this.$newFolder = this.cloudService.$newFolder.subscribe(() => this.newFolderModal())
  }

  ngOnDestroy(): void {
    this.$newFolder.unsubscribe()
  }

  openBottomSheet(): void {
    this._bottomSheet.open(BottomSheetComponent);
  }

  newFolderModal(){
    const dialogRef = this.dialog.open(ModalFolderComponent, {
      data: {name: ''},
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result && result.trim() != ''){
        this.createFolder(result)
      }
    })
  }

  createFolder(name: any){
    this.cloudService.createFolder(name.trim(), this.path).subscribe({
      next: (res) => {
        toastr.success(res.message, 'Successful')
        // this.$newActionReload.emit(true)
        this.dashBoardService.reloadDashboard(true)
      },
      error: (err) => {
        toastr.error(err.error.message, 'Error')
        this.maskLoad.next(false)
      }
    });
  }

  uploadFile($event: any){
    const files = $event.target.files
    this.progressUpload.loading = true
    this.progressUpload.value = 0
    this.progressUpload.text = 'Uploading...'
    this.progressUpload.uploaded = []
    this.expansionPanel.close();

    document.getElementById('accordion-uploading')?.classList.add('show')
    this.cloudService.uploadFile(files, this.path).subscribe({
      next: (res) => {
        if(!res?.event){
          this.progressUpload.value = res.progress
        }else{
          this.progressUpload.uploaded = res.event.responses
          this.progressUpload.text = 'Finished'
          this.expansionPanel.open();
          this.progressUpload.loading = false
          // this.$newActionReload.emit(true)
          this.dashBoardService.reloadDashboard(true)
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
