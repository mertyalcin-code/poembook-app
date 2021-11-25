import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { NotificationType } from '../enum/notification-type.enum';
import { Result } from '../model/result/result';
import { AuthenticationService } from '../service/authentication.service';
import { NotificationService } from '../service/notification.service';
import { UserService } from '../service/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit,OnDestroy {
  public showLoading=false;
  private subscriptions: Subscription[] = [];

  constructor(private userService: UserService,
    private authenticationService: AuthenticationService,
    private notificationService: NotificationService,
    private router: Router
    ) { }
 
  ngOnInit():void {
    if (this.authenticationService.isUserLoggedIn()){
      this.router.navigateByUrl('user/management')
    }
    else {
      this.router.navigateByUrl('/register');
    }
  }
  registerForm = new FormGroup({
    firstName: new FormControl("",[Validators.required,]),
    lastName: new FormControl("",[Validators.required]),
    username: new FormControl("",[Validators.required,Validators.minLength(6),Validators.maxLength(20)]),
    email: new FormControl("",[Validators.required,Validators.email,]),
  })
  
  get firstName(){
    return this.registerForm.get("firstName")
  }
  get lastName(){
    return this.registerForm.get("lastName")
  }
  get username(){
    return this.registerForm.get("username")
  }
  get email(){
    return this.registerForm.get("email")
  } 
  public onRegister(formData:FormData): void {    
    this.showLoading = true;
    this.subscriptions.push(
      this.userService.register(formData).subscribe(
       (result:Result) =>{
         if(!result.success){
          this.sendErrorNotification(NotificationType.ERROR,result.message)
          this.showLoading = false;
         
         }
         else{
           this.sendSuccessNotification(NotificationType.SUCCESS,result.message)
           this.showLoading = false;
           this.router.navigateByUrl('/register-success');
           
         }
       },
       (errorResponse: HttpErrorResponse) => {
        this.sendErrorNotification(NotificationType.ERROR, errorResponse.error.message);
        this.showLoading = false;
      }
      )
    );
  
  }

  private sendErrorNotification(notificationType: NotificationType, message: string): void {
    if (message) {
      this.notificationService.notify(notificationType, message);
    } else {
      this.notificationService.notify(notificationType, 'Bir şeyler ters gitti. Daha sonra tekrar edene');
    }
  }
  private sendSuccessNotification(notificationType: NotificationType, message: string): void {
    if (message) {
      this.notificationService.notify(notificationType, message);
    } else {
      this.notificationService.notify(notificationType, 'Başarılı');
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

}


