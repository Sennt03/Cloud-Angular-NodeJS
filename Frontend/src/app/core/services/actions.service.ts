import { Injectable, signal } from '@angular/core';
import { defaultInfoActions, LsActionsInfo } from '@models/cloud.models';

@Injectable({
  providedIn: 'root'
})
export class ActionsService {
  private _infoActual = signal<LsActionsInfo>({...defaultInfoActions})

  infoActual = this._infoActual.asReadonly()

  setInfo(data: LsActionsInfo){
    this._infoActual.set(data)
  }
}
