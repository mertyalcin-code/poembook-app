import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from "@angular/router";
import { NotificationType } from "../enum/notification-type.enum";
import { AuthenticationService } from "../service/authentication.service";
import { NotificationService } from "../service/notification.service";

@Injectable({providedIn: 'root'})
export class EditorGuard implements CanActivate {

  constructor(
      private authenticationService: AuthenticationService, 
      private router: Router,
      private notificationService: NotificationService) {}

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return this.isUserEditorOrAdminOrSuperAdmin();
  }

  private isUserEditorOrAdminOrSuperAdmin(): boolean {
    if (this.authenticationService.isAdminOrSuperAdmin || this.authenticationService.isEditor) {
      return true;
    }
    this.router.navigate(['/home']);
    this.notificationService.notify(NotificationType.ERROR, `Yetkin yok`);
    return false;
  }

}