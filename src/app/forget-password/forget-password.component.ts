import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';
import { NotificationType } from '../enum/notification-type.enum';
import { Result } from '../model/result/result';
import { AuthenticationService } from '../service/authentication.service';
import { NotificationService } from '../service/notification.service';
import { UserService } from '../service/user.service';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.css']
})
export class ForgetPasswordComponent implements OnInit {

  public showLoading=false;
  private subscriptions: Subscription[] = [];
  public siteKey=environment.siteKey;

  constructor(private userService: UserService,
    private authenticationService: AuthenticationService,
    private notificationService: NotificationService,
    private router: Router
    ) { }
 
  ngOnInit():void {
    if (this.authenticationService.isUserLoggedIn()){
      this.router.navigateByUrl('home')
    }
    else {
      this.router.navigateByUrl('/forget-password');
    }
  }
  forgetPasswordForm = new FormGroup({
    email: new FormControl("",[Validators.required,Validators.email,]),
    recaptcha: new FormControl("",[Validators.required]),
  }) 
  get email(){
    return this.forgetPasswordForm.get("email")
  } 
  public onForgetPassword(): void {    
    this.showLoading = true;
    this.subscriptions.push(
      this.authenticationService.forgetPassword(this.authenticationService.forgetPasswordData(
        this.email.value
      )).subscribe(
       (result:Result) =>{
         if(!result.success){
          this.sendNotification(NotificationType.ERROR,result.message)
          this.showLoading = false;
         
         }
         else{
           this.sendNotification(NotificationType.SUCCESS,result.message)
           this.showLoading = false;
           this.router.navigateByUrl('/login');
           
         }
       },
       (errorResponse: HttpErrorResponse) => {
        this.sendNotification(NotificationType.ERROR, errorResponse.error.message);
        this.showLoading = false;
      }
      )
    );
  
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

}