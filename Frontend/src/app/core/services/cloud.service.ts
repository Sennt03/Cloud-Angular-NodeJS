import { HttpClient, HttpEvent, HttpEventType } from '@angular/common/http';
import { EventEmitter, inject, Injectable } from '@angular/core';
import { LsResMessage, LsUploadFile } from '@models/cloud.models';
import { Observable, Subject } from 'rxjs';
import { AuthService } from './auth.service';
import { environment } from 'enviroments/enviroment';

@Injectable({
  providedIn: 'root'
})
export class CloudService {
  private url = `${environment.url_api}/cloud`

  private http = inject(HttpClient)

  constructor() { }

  uploadFile(files: { [key: string]: File }, path: string): Observable<{ progress: number, event?: LsUploadFile }> {
    const formdata = new FormData();

    for (const key in files) {
      if (files.hasOwnProperty(key)) {
        formdata.append('files', files[key]);
      }
    }
    formdata.append('path', decodeURI(path));

    const progressSubject = new Subject<{ progress: number, event?: LsUploadFile }>();

    this.http.post<LsUploadFile>(`${this.url}/uploadFile/${decodeURI(path)}`, formdata, {
      reportProgress: true,
      observe: 'events'
    }).subscribe((event: HttpEvent<any>) => {
      switch (event.type) {
        case HttpEventType.UploadProgress:
          const progress = event.total ? Math.round(100 * event.loaded / event.total) : 0;
          progressSubject.next({ progress });
          break;
        case HttpEventType.Response:
          progressSubject.next({ progress: 100, event: event.body });
          progressSubject.complete();
          break;
      }
    });

    return progressSubject.asObservable();
  }

  createFolder(name: string, path: string): Observable<LsResMessage>{
    return this.http.post<LsResMessage>(`${this.url}/createDir/${decodeURI(path)}`, { name })
  }

  downloadFile(path: string): Observable<{ progress: number, file?: Blob }> {
    const progressSubject = new Subject<{ progress: number, file?: Blob }>();

    this.http.get(`${this.url}/downloadFile/${decodeURI(path)}`, {
      responseType: 'blob',
      reportProgress: true,
      observe: 'events'
    }).subscribe((event: HttpEvent<any>) => {
      switch (event.type) {
        case HttpEventType.DownloadProgress:
          const progress = event.total ? Math.round(100 * event.loaded / event.total) : 0;
          progressSubject.next({ progress });
          break;
        case HttpEventType.Response:
          progressSubject.next({ progress: 100, file: event.body });
          progressSubject.complete();
          break;
      }
    });

    return progressSubject.asObservable();
  }

  deleteFile(path: string): Observable<LsResMessage>{
    return this.http.delete<LsResMessage>(`${this.url}/delete/${decodeURI(path)}`)
  }

  rename(name: string, path: string): Observable<LsResMessage>{
    return this.http.post<LsResMessage>(this.url+'/rename/'+decodeURI(path), { name })
  }
  
  copy(path: string, newPath: string, isFile: boolean): Observable<LsResMessage>{
    return this.http.post<LsResMessage>(this.url+'/copy/'+decodeURI(path), { newPath, isFile })
  }
  
  move(path: string, newPath: string, isFile: boolean): Observable<LsResMessage>{
    return this.http.post<LsResMessage>(this.url+'/move/'+decodeURI(path), { newPath, isFile })
  }
  
}
