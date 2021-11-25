import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { NotificationType } from '../enum/notification-type.enum';
import { User } from '../model/user';
import { AuthenticationService } from '../service/authentication.service';
import { NotificationService } from '../service/notification.service';
import { HeaderType } from '../enum/header-type.enum';
import { FormControl, FormGroup, Validators } from '@angular/forms';



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit,OnDestroy{
  showLoading: boolean;
  private subscriptions: Subscription[] = [];

  constructor(
    private router: Router,
    private authenticationService:AuthenticationService,
    private notificationService: NotificationService            
      ) { }

  ngOnInit():void {
    if (this.authenticationService.isUserLoggedIn()){
      this.router.navigateByUrl('/home')
    }
    else {
      this.router.navigateByUrl('/login');
    }
  }
  
  loginForm = new FormGroup({
    username: new FormControl("",[Validators.required,Validators.minLength(5),Validators.maxLength(20)]),
    password: new FormControl("",[Validators.required,Validators.minLength(6),Validators.maxLength(20)])
  })
  
  get username(){
    return this.loginForm.get("username")
  }
  get password(){
    return this.loginForm.get("password")
  }

  clearForm() {
    this.loginForm.patchValue({
      username: '',
      password: '',    
    });
  }
  public onLogin(): void {
    
    this.showLoading = true;
    this.subscriptions.push(
      this.authenticationService.login(this.authenticationService.createLoginFormData(this.username.value,this.password.value)).subscribe(
        (response: HttpResponse<User>) => {                   
          const token = response.headers.get(HeaderType.JWT_TOKEN);
          this.authenticationService.saveToken(token);
          this.authenticationService.addUserToLocalCache(response.body);          
          this.router.navigateByUrl('/home');
          location.reload();
          this.showLoading = false;
          this.notificationService.notify(NotificationType.SUCCESS,"Başarılı Giriş");
        },
        (errorResponse: HttpErrorResponse) => {
          this.sendErrorNotification(NotificationType.ERROR, errorResponse.error.message);
          this.showLoading = false;         
          this.clearForm();
        }
      )
    );
  }

  private sendErrorNotification(notificationType: NotificationType, message: string): void {
    if (message) {
      this.notificationService.notify(notificationType, message);
    } else {
      this.notificationService.notify(notificationType, 'Bir şeyler ters gitti. Daha sonra tekrar dene');
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

}
