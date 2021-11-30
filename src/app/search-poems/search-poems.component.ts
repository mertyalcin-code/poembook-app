import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { NotificationType } from '../enum/notification-type.enum';
import { DataResult } from '../model/result/data-result';
import { PoemBox } from '../model/result/poemBox';
import { AuthenticationService } from '../service/authentication.service';
import { CategoryService } from '../service/category.service';
import { NotificationService } from '../service/notification.service';
import { PoemService } from '../service/poem.service';
import { UserService } from '../service/user.service';

@Component({
  selector: 'app-search-poems',
  templateUrl: './search-poems.component.html',
  styleUrls: ['./search-poems.component.css']
})
export class SearchPoemsComponent implements OnInit,OnDestroy {
  poems:PoemBox[]=[];
  poemsLoading=false;
  private subscriptions: Subscription[] = [];
  search:string;
  constructor(
    private userService: UserService,
    private poemService: PoemService,
    private router: Router,
    private authenticationService: AuthenticationService,
    private notificationService: NotificationService,
    private categoryService:CategoryService,
  ) { }

  ngOnInit() {
    this.searchPoems();
  }

  searchPoems(): void {
    this.poemsLoading=true;

    this.subscriptions.push(
      this.poemService.searchPoems(this.search).subscribe(
        (response: DataResult) => {
          if (response.success) {
          //  this.sendNotification(NotificationType.SUCCESS, response.message);
            this.poems=response.data;
            this.poemsLoading=false;
            
           
          } else {
            this.sendNotification(NotificationType.ERROR, response.message);
          }
        },
        (error: HttpErrorResponse) => {
          this.sendNotification(NotificationType.ERROR, error.error.message);
          this.poemsLoading=false;
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
  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }
}
