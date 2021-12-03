import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../model/user';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Role } from '../enum/role.enum';
import { UserService } from './user.service';
import { LocalService } from './local.service';
import { Result } from '../model/result/result';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
public host= environment.apiUrl;
private token: string; 
private loggedInUsername:string;

private jwtHelper = new JwtHelperService();
constructor(private http: HttpClient,private userService:UserService,private localService:LocalService) { }

public login(formData: FormData): Observable<HttpResponse<User>> { 
  return this.http.post<User>(`${this.host}/user/login`, formData, { observe: 'response' });
}
public register(user: User): Observable<User> {
  return this.http.post<User>(`${this.host}/user/register`, user);
} 
public forgetPassword(formData: FormData): Observable<Result> {
  return this.http.post<Result>(`${this.host}/user/forget-password`,formData);
} 
public resetPasswordWithCode(code:string): Observable<Result> {
  return this.http.get<Result>(`${this.host}/user/forget-password/code/${code}`);
} 

public logOut(): void {
  this.token = null;
  this.localService.clearToken();
}
public saveToken(token: string): void {
  this.token = token;
  this.localService.setJsonValue('token',token);
}

public updateLoggedInUser(user:User): void {  
  this.localService.setJsonValue('user',user);
}
 public addUserToLocalCache(user: User): void {
  this.localService.setJsonValue('user',user);
 }


 public getUserFromLocalCache(): User {   
  return this.localService.getJsonValue('user');
 }

public loadToken(): void {
  this.token = this.localService.getJsonValue('token');
}

public getToken(): string {
  return this.token;
}

public isUserLoggedIn(): boolean {
  this.loadToken();
  if (this.token != null && this.token !== ''){
    if (this.jwtHelper.decodeToken(this.token).sub != null || '') {
      if (!this.jwtHelper.isTokenExpired(this.token)) {
        this.loggedInUsername = this.jwtHelper.decodeToken(this.token).sub;
        return true;
      }
    }
  } else {
    this.logOut();
    return false;
  }
}

private getUserRole(): string {
  return this.getUserFromLocalCache().role;
}
public get isAdmin(): boolean {
  return this.getUserRole() === Role.ADMIN || this.getUserRole() === Role.SUPER_ADMIN;
}
public get isSuperAdmin(): boolean {
  return this.getUserRole() === Role.SUPER_ADMIN;
}
public get isAdminOrSuperAdmin(): boolean {
  return this.isAdmin || this.isSuperAdmin;
}
public get isAdminOrSuperAdminorOrEditor(): boolean {
  return this.isAdmin || this.isSuperAdmin || this.isEditor;
}

public get isEditor(): boolean {
  return this.isAdmin || this.getUserRole() === Role.EDITOR;
}

public get isAdminOrEditor(): boolean {
  return this.isAdmin || this.isEditor;
}
public createLoginFormData(username: string, password: string): FormData {
  const formData = new FormData();   
  formData.append('username', username);
  formData.append('password', password);
  return formData;
}
public forgetPasswordData(email:string): FormData {
  const formData = new FormData();   
  formData.append('email', email);    
  return formData;
}

}
