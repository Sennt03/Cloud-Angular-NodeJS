import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { materialImports } from '@material/material.imports';
import { defaultInfoActions, LsActionsInfo } from '@models/cloud.models';
import { ActionsService } from '@services/actions.service';
import { CloudService } from '@services/cloud.service';
import { DashboardService } from '@services/dashboard.service';
import toastr from '@shared/utils/toastr';

@Component({
  selector: 'app-modal-action',
  standalone: true,
  imports: [materialImports, CommonModule],
  templateUrl: './modal-action.component.html',
  styleUrl: './modal-action.component.scss'
})
export class ModalActionComponent{

  private actionsService = inject(ActionsService)
  private cloudService = inject(CloudService)
  private dashBoardService = inject(DashboardService)

  info = this.actionsService.infoActual

  cancel(){
    this.actionsService.setInfo({...defaultInfoActions})
  }

  confirm(){
    let newPath = decodeURI(window.location.pathname)
    if(newPath.startsWith('/r')){
      newPath = newPath.slice(2)
    }

    const isCopy = this.info().type == 'copy'

    const sub = isCopy ? this.cloudService.copy(this.info().path, newPath, this.info().isFile)
    : this.cloudService.move(this.info().path, newPath, this.info().isFile)
    
    this.cancel()
    toastr.setOption('timeOut', '0')
    toastr.info(isCopy ? 'Copying...' : 'Moving...', '')

    sub.subscribe({
      next: res => {
        toastr.setDefaultsOptions()
        toastr.clear()
        toastr.success(res.message, '')
        this.dashBoardService.reloadDashboard(true)
      },
      error: err => {
        toastr.setDefaultsOptions()
        toastr.clear()
        toastr.error(err.error.message, '')

      }
    })
  }
}
