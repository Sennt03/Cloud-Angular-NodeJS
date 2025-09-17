import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { materialImports } from '@material/material.imports';
import { LsAll } from '@models/cloud.models';
import { CloudService } from '@services/cloud.service';
import { LoadingComponent } from '@shared/shared.imports';
import toastr from '@shared/utils/toastr';

@Component({
  selector: 'app-all.component',
  standalone: true,
  imports: [...materialImports, LoadingComponent],
  templateUrl: './all.component.html',
  styleUrl: './all.component.scss'
})
export class AllComponent {

  private cloudService = inject(CloudService)
  private router = inject(Router)

  type = signal<'files' | 'folders'>(window.location.pathname.includes('files') ? 'files' : 'folders')
  data = signal<LsAll[]>([])
  loading = signal(false)

  constructor(){
    this.load()
  }

  load(){
    this.loading.set(true)

    const sub = this.type() == 'files' ? this.cloudService.getAllFiles()
    : this.cloudService.getAllFolders()

    sub.subscribe({
      next: res => {
        this.loading.set(false)
        this.data.set(res)
      },
      error: err => {
        this.loading.set(false)
        toastr.error('Error unexpected!', '')
      }
    })

  }

  go(path: string){
    this.router.navigate([path])
  }

}
