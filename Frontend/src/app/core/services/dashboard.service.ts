import { inject, Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { catchError, Observable, ObservableInput, Subject, throwError } from 'rxjs';
import { AuthService } from './auth.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { LsOpenDir } from '@models/dashboard.models';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private url = `${environment.url_api}/cloud`

  private reloadDashboardSubject = new Subject<{data: any}>();
  reloadDashboard$ = this.reloadDashboardSubject.asObservable();

  private http = inject(HttpClient)

  constructor() { }

  openDir(path: string): Observable<LsOpenDir>{
    return this.http.get<LsOpenDir>(`${this.url}/openDir/${path}`)
  }

  reloadDashboard(data: any) {
    this.reloadDashboardSubject.next(data);
  }
}
