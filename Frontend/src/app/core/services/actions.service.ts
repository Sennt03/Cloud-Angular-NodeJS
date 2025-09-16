import { Injectable, signal } from '@angular/core';
import { defaultInfoActions, LsActionsInfo } from '@models/cloud.models';

@Injectable({
  providedIn: 'root'
})
export class ActionsService {
  private infoActual = signal<LsActionsInfo>({...defaultInfoActions})

  public get info(): LsActionsInfo{
    return this.infoActual()
  }
}
