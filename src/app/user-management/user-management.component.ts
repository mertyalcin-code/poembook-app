import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Subscription } from 'rxjs';
import { NotificationType } from 'src/app/enum/notification-type.enum';
import { Role } from 'src/app/enum/role.enum';
import { DataResult } from 'src/app/model/result/data-result';
import { Result } from 'src/app/model/result/result';
import { User } from 'src/app/model/user';
import { AuthenticationService } from 'src/app/service/authentication.service';
import { NotificationService } from 'src/app/service/notification.service';
import { UserService } from 'src/app/service/user.service';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { FileUploadStatus } from 'src/app/model/file-upload.status';
import { AdminService } from '../service/admin.service';
@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit,OnDestroy {
  private titleSubject = new BehaviorSubject<string>('Users');
  public titleAction$ = this.titleSubject.asObservable();

  
  public users:User[];
  public user: User;
  private currentUsername: string;
  public refreshing: boolean;
  public selectedUser: User;
  public editUser = new User();
  private subscriptions: Subscription[]=[];

  public fileStatus = new FileUploadStatus();
  public fileName: string;
  public profileImage: File;
  
  constructor(
    private userService: UserService,
    private  router: Router,
    private  authenticationService:AuthenticationService,
    private notificationService: NotificationService,
    private adminService: AdminService
    ) { }

    ngOnInit(): void{
      this.user = this.authenticationService.getUserFromLocalCache();
      this.currentUsername=this.authenticationService.getUserFromLocalCache().username;
      this.getUsers();      
    }
    public onLogOut(): void {
      this.authenticationService.logOut();
      this.router.navigate(['/login']);
      this.sendNotification(NotificationType.SUCCESS, `Başarı ile çıkış yapıldı`);
    }    
navigateToEdit():void {
  this.router.navigateByUrl("/admin/user-edit")
}
changeTitle(title:string):void {
  this.titleSubject.next(title);
}
onSelectUser(selectedUser: User):void {
  this.selectedUser = selectedUser;
  this.clickButton('openUserInfo');
}
onDeleteUser(username: string):void {
  this.subscriptions.push(
    this.adminService.deleteUser(username).subscribe(
      (response: Result) => {
        if(response.success){
          this.sendNotification(NotificationType.SUCCESS, response.message);
          this.getUsers();
        } 
        else{
          this.sendNotification(NotificationType.ERROR, response.message);
        }     
        
      },
      (error: HttpErrorResponse) => {
        this.sendNotification(NotificationType.ERROR, error.error.message);
      }
    )
  );

}
onEditUser(editUser: User):void {
  this.editUser = editUser;
  this.currentUsername = editUser.username;
  this.clickButton('openUserEdit');
}

public getUsers():void{
  this.refreshing = true;
  this.subscriptions.push(

  )
  this.adminService.getUsers().subscribe(
    (response:DataResult)=>{
      if(response.success){
          this.adminService.addUsersToLocalCache(response.data);
          this.users = response.data;
          this.refreshing = false
          this.sendNotification(NotificationType.SUCCESS,response.message);
      }
      else{
        this.sendNotification(NotificationType.ERROR,response.message);
        this.refreshing = false
      }
      
    },
    (errorResponse: HttpErrorResponse)=>{
      this.sendNotification(NotificationType.ERROR,errorResponse.error.message);
      this.refreshing = false
      
    }    
  )
}
public searchUsers(searchTerm: string): void {
  const results: User[] = [];
  for (const user of this.adminService.getUsersFromLocalCache()) {
    if (user.firstName.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1 ||
        user.lastName.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1 ||
        user.username.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1 ) {
        results.push(user);
    }
  }
  this.users = results;
  if (results.length === 0 || !searchTerm) {
    this.users = this.adminService.getUsersFromLocalCache();
  }
}

private getUserRole(): string {
  return this.authenticationService.getUserFromLocalCache().role;
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

public get isEditor(): boolean {
  return this.isAdmin || this.getUserRole() === Role.EDITOR;
}

public get isAdminOrEditor(): boolean {
  return this.isAdmin || this.isEditor;
}
onResetPassword(emailForm: NgForm):void{
  this.refreshing = true;
  const emailAddress = emailForm.value['reset-password-email'];
  this.subscriptions.push(
    this.adminService.resetPassword(emailAddress).subscribe(
      (response: Result) => {
        if(response.success){
          this.sendNotification(NotificationType.SUCCESS, response.message);
          this.refreshing = false;
        }
        else{
          this.sendNotification(NotificationType.WARNING,response.message);
        this.refreshing = false;
        }      
      },
      (error: HttpErrorResponse) => {
        this.sendNotification(NotificationType.WARNING, error.error.message);
        this.refreshing = false;
      },
      () => emailForm.reset()
    )
  );

}

private sendNotification(notificationType: NotificationType,message: string):void{
  if(message){
    this.notificationService.notify(notificationType,message);
  }
  else{
    this.notificationService.notify(NotificationType.ERROR,'bir şeyler ters gitti.');
  }
}
public onProfileImageChange(fileName: string, profileImage: File): void {
  this.fileName =  fileName;
  this.profileImage = profileImage;
}

public saveNewUser(): void {
  this.clickButton('new-user-save');
}
public onAddNewUser(userForm: NgForm): void {
  this.refreshing=true;
  const formData = this.userService.createUserFormData(this.currentUsername, userForm.value);
  this.subscriptions.push(
    this.adminService.addUser(formData).subscribe(
      (response: Result) => {
        if(response.success){
          this.clickButton('new-user-close');
          this.getUsers();
          userForm.reset();
          this.refreshing=false;
          this.sendNotification(NotificationType.SUCCESS, response.message);
        }
        else{
          this.sendNotification(NotificationType.ERROR, response.message);
          this.refreshing=false;
        }
      
      },
      (errorResponse: HttpErrorResponse) => {
        this.sendNotification(NotificationType.ERROR, errorResponse.error.message);
        this.refreshing=false;
      }
    )
    );
}
onSelectAvatar(selectedUser:User){
  this.selectedUser = selectedUser;
  this.clickButton('openAvatarChange');

}
public onUpdateUser(): void {
  const formData = this.updateUserFormData(this.currentUsername, this.editUser);
  this.subscriptions.push(
    this.adminService.updateUser(formData).subscribe(
      (response: Result) => {
        if(response.success){
          this.clickButton('closeEditUserModalButton');
          this.getUsers();
          this.fileName = null;
          this.profileImage = null;
          this.sendNotification(NotificationType.SUCCESS,response.message);
        }
        else{
          this.sendNotification(NotificationType.ERROR, response.message);
        this.profileImage = null;
        }
        
      },
      (errorResponse: HttpErrorResponse) => {
        this.sendNotification(NotificationType.ERROR, errorResponse.error.message);
        this.profileImage = null;
      }
    )
    );
}
public updateUserFormData(loggedInUsername: string, user: User): FormData {
  const formData = new FormData();    
  formData.append('adminUsername', loggedInUsername);
  formData.append('userUsername', this.editUser.username);
  formData.append('firstName', user.firstName);
  formData.append('lastName', user.lastName);
  formData.append('username', user.username);
  formData.append('email', user.email);
  formData.append('role', user.role);
  formData.append('isActive', JSON.stringify(user.active));
  formData.append('isNonLocked', JSON.stringify(user.notLocked));
  return formData;
}
public onUpdateCurrentUser(user: User): void {
  this.refreshing = true;
  this.currentUsername = this.authenticationService.getUserFromLocalCache().username;
  const formData = this.userService.createUserFormData(this.currentUsername, user);
  this.subscriptions.push(
    this.adminService.updateUser(formData).subscribe(
      (response: Result) => {
        if(response.success){
          this.clickButton('closeEditUserModalButton');
          this.getUsers();
          this.fileName = null;
          this.profileImage = null;
          this.sendNotification(NotificationType.SUCCESS,response.message);
        }
        else{
          this.sendNotification(NotificationType.ERROR, response.message);
        this.profileImage = null;
        }
        
      },
      (errorResponse: HttpErrorResponse) => {
        this.sendNotification(NotificationType.ERROR, errorResponse.error.message);
        this.profileImage = null;
      }    
    )
    );
}

public onUpdateProfileImage(): void {
  const formData = new FormData();
  formData.append('avatar', this.profileImage);
  formData.append('username', this.user.username);

  this.subscriptions.push(
    this.userService.updateAvatar(formData).subscribe(
      (response: Result) => {
        if(response.success){         
        
          this.sendNotification(NotificationType.SUCCESS, response.message);  
           
        }
        
      },
      (errorResponse: HttpErrorResponse) => {
        this.sendNotification(NotificationType.ERROR, errorResponse.error.message);
        this.fileStatus.status = 'done';
      }
    )
  );
}
public onEditAvatar(): void {
  const formData = new FormData();
  formData.append('avatar', this.profileImage);
  formData.append('username', this.selectedUser.username);
  this.subscriptions.push(
    this.userService.updateAvatar(formData).subscribe(
      (response: Result) => {
        if(response.success){          
          this.sendNotification(NotificationType.SUCCESS, response.message);
        }
        
      },
      (errorResponse: HttpErrorResponse) => {
        this.sendNotification(NotificationType.ERROR, errorResponse.error.message);
        this.fileStatus.status = 'done';
      }
    )
  );
}
public updateProfileImage(): void {
  this.clickButton('profile-image-input');
}
public updateUserAvatar(): void {
  this.clickButton('edit-avatar-input');
}

public getUser(username): any {
  this.subscriptions.push(
    this.userService.getUser(username).subscribe(
      (response: DataResult) => {
        if(response.success){
          return response.data;
        }
        
      }
    )
  );
}

private clickButton(buttonId: string): void {
  document.getElementById(buttonId).click();
}









ngOnDestroy(): void {
  this.subscriptions.forEach(sub => sub.unsubscribe());
}
}
