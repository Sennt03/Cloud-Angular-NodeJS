import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Sort } from '@angular/material/sort';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { Ext, extensionToIcon, LsOpenDir } from '@models/dashboard.models';
import { DashboardService } from '@services/dashboard.service';
import { UserService } from '@services/user.service';
import { sharedImports } from '@shared/shared.imports';
import toastr from '@shared/utils/toastr';
import { Subscription } from 'rxjs';
import { ActionsComponent } from '../components/actions/actions.component';
import { UploadComponent } from '../components/upload/upload.component';

@Component({
  selector: 'app-cloud.component',
  standalone: true,
  imports: [...sharedImports, RouterModule, FormsModule, ActionsComponent, UploadComponent],
  templateUrl: './cloud.component.html',
  styleUrl: './cloud.component.scss'
})
export class CloudComponent implements OnInit{
  viewTable = true

  maskLoad = signal(false)
  loading = true
  path!: string
  urlSubscription!: Subscription

  paths: {
    path: string,
    link: string
  }[] = []

  data: LsOpenDir = {
    path: '',
    content: {
      directories: [],
      files: []
    }
  }

  sortedDirectories: any = []
  sortedFiles: any = []

  constructor(
    private router: Router,
    private dashBoardService: DashboardService,
    private userService: UserService
  ){
    if (window.innerWidth < 768) this.viewTable = false
  }

  ngOnInit(): void {
    this.processURL()
    this.urlSubscription = this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.processURL();
      }
    });

    this.dashBoardService.reloadDashboard$.subscribe(data => {
      this.newActionReload()
    });
  }

  ngOnDestroy(): void {
    this.urlSubscription.unsubscribe()
  }

  processURL() {
    const data: any = []
    const details = this.router.url.split('/').slice(2)
    details.forEach((path, i) => {
      const ruta = details.slice(0, i + 1).join('/')
      const detail = {
        path,
        link: `/r/${ruta}`
      }
      
      data.push(detail)
    });
    this.paths = this.router.url.split('/').length > 2 ? data : [];
    this.path = details.join('/')
    this.openDir()
  }

  getIcon(name: string){
    const parts = name.split('.');
    const ext = parts[parts.length - 1] as Ext;

    return extensionToIcon[ext] ?? extensionToIcon['default']
  }

  navigateFolder(path: string){
    const newPath = this.path + '/' + path
    this.router.navigate([`/r/${newPath}`])
  }

  newActionReload(){
    this.openDir()
    this.userService.userProfile.emit(true)
  }

  compare(a: number | string | Date, b: number | string | Date, isAsc: boolean) {
    if (typeof a === 'string' && typeof b === 'string') {
      const dateA = new Date(a);
      const dateB = new Date(b);
      if (!isNaN(dateA.getTime()) && !isNaN(dateB.getTime())) {
        a = dateA;
        b = dateB;
      }
    } else if (a instanceof Date && b instanceof Date) {
      a = a.getTime();
      b = b.getTime();
    }

    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

  getDate(dateString: Date){
    const options: Intl.DateTimeFormatOptions = {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    };

    const date = new Date(dateString);
    const formattedDate = new Intl.DateTimeFormat('es-ES', options).format(date);

    return formattedDate;
  }

  getSize(size: any){
    if(size == 0) return '0 MB'

    const sizeInKB: any = (size / 1024).toFixed(0)

    if (sizeInKB >= 1024 * 1024) {
        const sizeInGB = (sizeInKB / (1024 * 1024)).toFixed(2);
        return `${sizeInGB} GB`;
    } 
    
    if (sizeInKB >= 1024) {
        const sizeInMB = (sizeInKB / 1024).toFixed(2);
        return `${sizeInMB} MB`;
    }
    
    return `${sizeInKB} KB`;
  }

  sortDirectories(sort: Sort | null) {
    this.sortData(sort, 'directories')
  }
  
  sortFiles(sort: Sort | null) {
    this.sortData(sort, 'files')
  }

  sortData(sort: Sort | null, type: 'files' | 'directories'){
    const data = this.data.content[type].slice();
    const sortedArray = type == 'files' ? 'sortedFiles' : 'sortedDirectories'

    if (!sort || !sort.active || sort.direction === '') {
      this[sortedArray] = (data as never);
      return;
    }
  
    this[sortedArray] = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'name':
          return this.compare(a.name, b.name, isAsc);
        case 'size':
          return this.compare(a.size, b.size, isAsc);
        case 'date':
          return this.compare(a.createdAt, b.createdAt, isAsc);
        default:
          return 0;
      }
    }) as never;
  }

  openDir(){
    this.maskLoad.set(true)
    this.dashBoardService.openDir(this.path).subscribe({
      next: (res) => {
        this.data = res
        this.sortDirectories(null)
        this.sortFiles(null)
      },
      error: (err) => {
        toastr.error(`/${this.path} - Forbidden.`, '')
        this.router.navigate([`/`])
      },
      complete: () => {
        this.loading = false
        this.maskLoad.set(false)
      }
    })
  }
}
