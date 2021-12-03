import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { NotificationType } from 'src/app/enum/notification-type.enum';
import { Result } from 'src/app/model/result/result';
import { AuthenticationService } from 'src/app/service/authentication.service';
import { NotificationService } from 'src/app/service/notification.service';

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.css']
})
export class PasswordResetComponent implements OnInit,OnDestroy{
code:string;
message:String;
loading=false;
private subscriptions: Subscription[] = [];
  constructor(
    private authenticationService:AuthenticationService,
    private router: ActivatedRoute,
    private notificationService: NotificationService
    ) { }

  ngOnInit() {
    this.code=this.router.snapshot.paramMap.get('code');
    this.onResetPasswordWithCode();
  }
 onResetPasswordWithCode(): void {
    this.loading==true;
    this.subscriptions.push(
    this.authenticationService.resetPasswordWithCode(this.code).subscribe(
      (response: Result) => {
        if (response.success) {
          this.message="Yeni şifreniz mail adresinize gönderildi";
          this.sendNotification(NotificationType.SUCCESS, response.message);
          this.loading==false;
        } else {
          this.message="Geçersiz kod";
          this.sendNotification(NotificationType.ERROR, response.message);
          this.loading==false;
        }
      },
      (errorResponse: HttpErrorResponse) => {
        this.sendNotification(
          NotificationType.ERROR,
          errorResponse.error.message          
        );
        this.message="Sistemse hata"
        this.loading==false;
      }
    ));
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
  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }
}
