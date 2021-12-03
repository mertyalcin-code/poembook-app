import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { NotificationType } from '../enum/notification-type.enum';
import { DataResult } from '../model/result/data-result';
import { Result } from '../model/result/result';
import { User } from '../model/user';
import { AuthenticationService } from '../service/authentication.service';
import { CategoryService } from '../service/category.service';
import { FollowService } from '../service/follow.service';
import { NotificationService } from '../service/notification.service';
import { PoemCommentService } from '../service/poem-comment.service';
import { PoemLikeService } from '../service/poem-like.service';
import { PoemService } from '../service/poem.service';
import { UserService } from '../service/user.service';

@Component({
  selector: 'app-my-account',
  templateUrl: './my-account.component.html',
  styleUrls: ['./my-account.component.css']
})
export class MyAccountComponent implements OnInit,OnDestroy { 
  public currentUser: User;
  public editUser=new User();
  private currentUsername:string
  public isFollowing: boolean;
  public newPassword: string;
  public loading= false;
  public newEmail:string;
  public newUsername:string;
  public fileName:string;
  public newAvatar:File;
  private subscriptions: Subscription[] = [];
  constructor(    
    private authenticationService: AuthenticationService,
    private notificationService: NotificationService,
    private userService: UserService,
    private router:Router
 ) { }
  ngOnInit() {    
    this.currentUser=this.authenticationService.getUserFromLocalCache();
    this.currentUsername=this.currentUser.username;
    this.getCurrentUserInfo();
  }
  onSelectEditProfile(): void {      
    this.clickButton('openEditProfile');
  }
  onSelectChangePassword(): void {      
    this.clickButton('openChangePassword');
  }
  onSelectChangeEmail(): void {      
    this.clickButton('openChangeEmail');
  }
  onSelectChangeUsername(): void {      
    this.clickButton('openChangeUsername');
  }
  onSelectChangeAvatar(): void {      
    this.clickButton('openChangeAvatar');
  }
  public onAvatarChange(fileName: string, newAvatar: File): void {
    this.fileName =  fileName;
    this.newAvatar = newAvatar;
  }
  public onSelectUploadAvatar(): void {
    this.clickButton('edit-avatar-input');
  }
  private clickButton(buttonId: string): void {
    document.getElementById(buttonId).click();
  }
  private getCurrentUserInfo(){
    this.subscriptions.push(    
      this.userService.getUser(this.currentUsername).subscribe(
        (response: DataResult) => {
          if (response.success) {
            this.editUser=response.data;
           // this.sendNotification(NotificationType.SUCCESS, response.message);          
          } else {
            this.sendNotification(NotificationType.ERROR, response.message);          }
        },
        (error: HttpErrorResponse) => {
          this.sendNotification(NotificationType.ERROR, error.error.message);
        }
      )
    );
  }
  public OnUpdateProfile(){
    this.loading=true;
   let formData=this.userService.updateProfileFormData(
     this.editUser
     );
    this.subscriptions.push(    
      this.userService.selfUpdate(formData).subscribe(
        (response: Result) => {
          if (response.success) {    
            this.loading=false;     
            this.clickButton("closeEditProfile")  
           this.sendNotification(NotificationType.SUCCESS, response.message);          
          } else {
            this.loading=false;
            this.sendNotification(NotificationType.ERROR, response.message);          }
        },
        (error: HttpErrorResponse) => {
          this.loading=false;
          this.sendNotification(NotificationType.ERROR, error.error.message);
        }
      )
    );
  }
  public onChangePassword(){
    this.loading=true;
    let formData=this.userService.changePasswordFormData(
      this.newPassword
    );
     this.subscriptions.push(    
       this.userService.changePassword(formData).subscribe(
         (response: Result) => {
           if (response.success) {       
            this.loading=false;  
             this.clickButton("closeChangePassword")  
            this.sendNotification(NotificationType.SUCCESS, response.message);          
           } else {
            this.loading=false;
             this.sendNotification(NotificationType.ERROR, response.message);          }
         },
         (error: HttpErrorResponse) => {
          this.loading=false;
           this.sendNotification(NotificationType.ERROR, error.error.message);
         }
       )
     );
   }
   public onChangeEmail(){
    this.loading=true;
    let formData=this.userService.changeEmailFormData(this.newEmail);
     this.subscriptions.push(    
       this.userService.changeEmail(formData).subscribe(
         (response: Result) => {
           if (response.success) {      
            this.loading=false;   
             this.clickButton("closeChangeEmail");  
            
            this.sendNotification(NotificationType.SUCCESS, response.message);          
           } else {
             this.sendNotification(NotificationType.ERROR, response.message); 
             this.loading=false;         }
         },
         (error: HttpErrorResponse) => {
           this.sendNotification(NotificationType.ERROR, error.error.message);
           this.loading=false;
         }
       )
     );
   }
   public onChangeUsername(){
     this.loading=true;
    let formData=this.userService.changeUsernameFormData(this.newUsername);
     this.subscriptions.push(    
       this.userService.changeUsername(formData).subscribe(
         (response: Result) => {
           if (response.success) {         
             this.clickButton("closeChangeUsername");  
             this.loading=false;
            this.sendNotification(NotificationType.SUCCESS, response.message);  
            this.authenticationService.logOut();    
            this.router.navigateByUrl("/login");
           } else {
             this.sendNotification(NotificationType.ERROR, response.message);  
             this.loading=false;        }
         },
         (error: HttpErrorResponse) => {
           this.sendNotification(NotificationType.ERROR, error.error.message);
           this.loading=false;
         }
       )
     );
   }

   public onUpdateAvatar(): void {
    this.loading=true;
    const formData = new FormData();
    formData.append('avatar', this.newAvatar);
    formData.append('username', this.currentUsername);
    this.subscriptions.push(
      this.userService.updateAvatar(formData).subscribe(
        (response: Result) => {
          if(response.success){     
            this.updateLoggedInUser();
            location.reload()
            this.loading=false;
            this.sendNotification(NotificationType.SUCCESS, response.message);
            this.clickButton("closeChangeAvatar");
          }
          else{
            this.loading=false;
            this.sendNotification(NotificationType.ERROR, response.message);
          }
          
        },
        (errorResponse: HttpErrorResponse) => {
          this.loading=false;
          this.sendNotification(NotificationType.ERROR, errorResponse.error.message);        
        }
      )
    );
  }

  private updateLoggedInUser():User{
    this.subscriptions.push(
      this.userService.getUser(this.currentUsername).subscribe(
        (response: DataResult) => {
          if(response.success){            
            this.authenticationService.updateLoggedInUser(response.data)
          }
          else{
       
            this.sendNotification(NotificationType.ERROR, response.message);
           
          }
          
        },
        (errorResponse: HttpErrorResponse) => {        
          this.sendNotification(NotificationType.ERROR, errorResponse.error.message);   
          
        }
      )
    );
    return null;
  }
  private sendNotification(
    notificationType: NotificationType,
    message: string
  ): void {
    if (message) {
      this.notificationService.notify(notificationType, message);
    } else {
      this.notificationService.notify(
        NotificationType.ERROR,
        'bir şeyler ters gitti.'
      );
    }
  }
  isAdmin():boolean{
   return this.authenticationService.isAdminOrSuperAdmin;
  }
  isEditor():boolean{
    return this.authenticationService.isAdminOrSuperAdminorOrEditor;
  }
  isSuperAdmin():boolean{
    return this.authenticationService.isSuperAdmin;
  }
  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }
}
