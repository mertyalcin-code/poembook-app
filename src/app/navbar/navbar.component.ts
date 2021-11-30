import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { NotificationType } from '../enum/notification-type.enum';
import { Notice } from '../model/notice';
import { DataResult } from '../model/result/data-result';
import { Result } from '../model/result/result';
import { User } from '../model/user';
import { AuthenticationService } from '../service/authentication.service';
import { NoticeService } from '../service/notice.service';
import { NotificationService } from '../service/notification.service';
import { UserService } from '../service/user.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit,OnDestroy{
  public user: User;
  loading=false;
  deleteLoading=false;
  private subscriptions: Subscription[] = [];
  notices: Notice[] = [];

  constructor(
    private authenticationService: AuthenticationService,
    private userService: UserService,
    private router: Router,
    private notificationService: NotificationService,
    private noticeService: NoticeService,
  ) {}

  ngOnInit(): void {
    this.user = this.authenticationService.getUserFromLocalCache();
    this.isLoggedIn();
    this.getAllNotices();
  }
  onLogout(): void {
    this.authenticationService.logOut();
    this.notificationService.notify(NotificationType.SUCCESS, 'Çıkış Yapıldı');
    this.router.navigateByUrl('/login');
  }
  
  public isLoggedIn(): boolean {
    if (this.authenticationService.isUserLoggedIn()) {
      return true;
    } else {
      return false;
    }
  }
  public getAllNotices(): void {
    this.loading=true;
    this.subscriptions.push();
    this.noticeService.listAll(this.noticeService.listAllNoticeData(this.user.username,this.user.username)).subscribe(
      (response: DataResult) => {
        if (response.success) {
          this.notices = response.data;
          this.loading=false;
        } else {
          this.sendNotification(NotificationType.ERROR, response.message);
          this.loading=false;      
          
        }
      },
      (errorResponse: HttpErrorResponse) => {
        this.sendNotification(
          NotificationType.ERROR,
          errorResponse.error.message
        );
        this.loading=false;
      }
    );
  }
  public deleteNotice(noticeId:number): void {
    this.deleteLoading=true;
    this.subscriptions.push();
    this.noticeService.delete(this.noticeService.deleteNoticeData(this.user.username,noticeId)).subscribe(
      (response: Result) => {
        if (response.success) {         
          this.deleteLoading=false;
          this.getAllNotices();
          this.sendNotification(NotificationType.SUCCESS, response.message);
        } else {
          this.sendNotification(NotificationType.ERROR, response.message);
          this.deleteLoading=false;
        }
      },
      (errorResponse: HttpErrorResponse) => {
        this.sendNotification(
          NotificationType.ERROR,
          errorResponse.error.message
        );
        this.deleteLoading=false;
      }
    );
  }
  public deleteAllNotices(): void {
    this.loading=true;
    this.subscriptions.push();
    this.noticeService.deleteAll(this.noticeService.deleteAllNoticeData(this.user.username,this.user.username)).subscribe(
      (response: Result) => {
        if (response.success) {         
          this.loading=false;
          this.getAllNotices();
          this.sendNotification(NotificationType.SUCCESS, response.message);
        } else {
          this.sendNotification(NotificationType.ERROR, response.message);
          this.loading=false;
        }
      },
      (errorResponse: HttpErrorResponse) => {
        this.sendNotification(
          NotificationType.ERROR,
          errorResponse.error.message
        );
        this.loading=false;
      }
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
  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
