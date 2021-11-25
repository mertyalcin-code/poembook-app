import { HttpClient, HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { DataResult } from '../model/result/data-result';
import { Result } from '../model/result/result';
import { User } from '../model/user';
import { NgModule }      from '@angular/core';
import { LocalService } from './local.service';
@Injectable({providedIn: 'root'})
export class UserService {
  private host = environment.apiUrl;

  constructor(private http: HttpClient,private localService:LocalService) {}

  
  public getUser(username): Observable<DataResult> {
    return this.http.get<DataResult>(`${this.host}/user/list/username/${username}`);
  }
  public getUserProfile(username): Observable<DataResult> {
    return this.http.get<DataResult>(`${this.host}/user/list/profile/${username}`);
  } 
 
  public changePassword(formData: FormData): Observable<Result> {
    return this.http.post<Result>(`${this.host}/user/change-password`, formData);
  }
  public changeEmail(formData: FormData): Observable<Result> {
    return this.http.post<Result>(`${this.host}/user/change-email`, formData);
  }
  public changeUsername(formData: FormData): Observable<Result> {
    return this.http.post<Result>(`${this.host}/user/change-username`, formData);
  }
  public register(formData: FormData): Observable<Result> {
    return this.http.post<Result>(`${this.host}/user/register`, formData);
  }
  
  public selfUpdate(formData: FormData): Observable<Result> {
    return this.http.post<Result>(`${this.host}/user/self-update`, formData);
  } 
 
  public updateAvatar(formData:FormData): Observable<Result> {
    return this.http.post<Result>(`${this.host}/avatar/add`,formData)
   
  }




  public createUserFormData(loggedInUsername: string, user: User): FormData {
    const formData = new FormData();   
    formData.append('currentUsername', loggedInUsername);
    formData.append('firstName', user.firstName);
    formData.append('lastName', user.lastName);
    formData.append('username', user.username);
    formData.append('email', user.email);
    formData.append('role', user.role);
    formData.append('isActive', JSON.stringify(user.active));
    formData.append('isNonLocked', JSON.stringify(user.notLocked));
    return formData;
  }


}
