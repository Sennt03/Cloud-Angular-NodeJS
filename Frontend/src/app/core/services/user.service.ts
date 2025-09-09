import { EventEmitter, Injectable } from '@angular/core';
import { environment } from 'enviroments/enviroment';
import { AuthService } from './auth.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, ObservableInput, throwError } from 'rxjs';
import { LsUser } from '@models/user.models';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private url = `${environment.url_api}/user`
  userProfile = new EventEmitter<boolean>()

  constructor(
    private authService: AuthService,
    private http: HttpClient
  ) { }

  getProfile(): Observable<LsUser>{
    return this.http.get<LsUser>(this.url)
  }

  isValidEmal(email: string){
    return this.http.post(`${this.url}/validateEmail`, { email })
  }
}
