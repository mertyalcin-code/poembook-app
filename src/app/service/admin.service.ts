import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { DataResult } from '../model/result/data-result';
import { Result } from '../model/result/result';
import { User } from '../model/user';
import { LocalService } from './local.service';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private host = environment.apiUrl+"/admin";

  constructor(private http: HttpClient,private localService:LocalService) {}

  public getUsers(): Observable<DataResult> {
    return this.http.get<DataResult>(`${this.host}/list`);
  }
  public getUser(username): Observable<DataResult> {
    return this.http.get<DataResult>(`${this.host}/list/username/${username}`);
  }

  public addUser(formData: FormData): Observable<Result> {
    return this.http.post<Result>(`${this.host}/add`, formData);
  } 

  public updateUser(formData: FormData): Observable<Result> {
    return this.http.post<Result>(`${this.host}/update`, formData);
  }  

  public resetPassword(email: string): Observable<Result> {
    return this.http.get<Result>(`${this.host}/reset-password/${email}`);
  }
 
  public getAllPoets(): Observable<DataResult> {
    return this.http.get<DataResult>(`${this.host}/list/poets`);
  }
  public getAllEditors(): Observable<DataResult> {
    return this.http.get<DataResult>(`${this.host}/list/editors`);
  }
  public getAllAdmins(): Observable<DataResult> {
    return this.http.get<DataResult>(`${this.host}/list/admins`);
  }
  public getAllSuperAdmins(): Observable<DataResult> {
    return this.http.get<DataResult>(`${this.host}/list/super-admins`);
  }


//super admin

public deleteUser(username: string): Observable<Result> {
  return this.http.delete<Result>(`${this.host}/delete/${username}`);
}
public makeSuperAdmin(username: string): Observable<Result> {
  return this.http.get<Result>(`${this.host}/make-super-admin/${username}`);
}






  public addUsersToLocalCache(users: User[]): void {
    this.localService.setJsonValue('users',users);    
   }
 
  public getUsersFromLocalCache(): User[] {
    if (this.localService.getJsonValue('users')) {
        return this.localService.getJsonValue('users');
    }
    return null;
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
  public updateUserFormData(username:string,user: User): FormData {
    const formData = new FormData();    
    formData.append('userUsername', username);
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
