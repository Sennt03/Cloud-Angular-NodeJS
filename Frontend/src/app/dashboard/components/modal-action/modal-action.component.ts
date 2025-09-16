import { Component, inject, OnInit, signal } from '@angular/core';
import { materialImports } from '@material/material.imports';
import { defaultInfoActions, LsActionsInfo } from '@models/cloud.models';
import { ActionsService } from '@services/actions.service';

@Component({
  selector: 'app-modal-action',
  standalone: true,
  imports: [materialImports],
  templateUrl: './modal-action.component.html',
  styleUrl: './modal-action.component.scss'
})
export class ModalActionComponent implements OnInit{

  private actionsService = inject(ActionsService)

  info = signal<LsActionsInfo>({...defaultInfoActions})

  ngOnInit(): void {
    this.loadInfo()
  }

  loadInfo(){
    this.info.set(this.actionsService.info)
    console.log('data cargada')
  }

}
