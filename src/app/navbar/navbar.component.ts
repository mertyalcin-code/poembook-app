import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NotificationType } from '../enum/notification-type.enum';
import { User } from '../model/user';
import { AuthenticationService } from '../service/authentication.service';
import { NotificationService } from '../service/notification.service';
import { UserService } from '../service/user.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit{
  public user: User;

  constructor(
    private authenticationService: AuthenticationService,
    private userService: UserService,
    private router: Router,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.user = this.authenticationService.getUserFromLocalCache();
    this.isLoggedIn();
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

}
