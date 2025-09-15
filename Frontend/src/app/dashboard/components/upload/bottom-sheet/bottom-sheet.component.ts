import { Component, inject } from '@angular/core';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { CloudService } from '@services/cloud.service';
import { sharedImports } from '@shared/shared.imports';

@Component({
  selector: 'app-bottom-sheet',
  standalone: true,
  imports: [...sharedImports],
  templateUrl: './bottom-sheet.component.html',
  styleUrl: './bottom-sheet.component.scss'
})
export class BottomSheetComponent {
  private _bottomSheetRef = inject(MatBottomSheetRef<BottomSheetComponent>)

  constructor() {}

  choose(option: string) {
    this._bottomSheetRef.dismiss(option);
  }


  close() {
    this._bottomSheetRef.dismiss();
  }
}
