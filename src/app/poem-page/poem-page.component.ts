import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { NotificationType } from '../enum/notification-type.enum';
import { DataResult } from '../model/result/data-result';
import { PoemBox } from '../model/result/poemBox';
import { AuthenticationService } from '../service/authentication.service';
import { NotificationService } from '../service/notification.service';
import { PoemService } from '../service/poem.service';

@Component({
  selector: 'app-poem-page',
  templateUrl: './poem-page.component.html',
  styleUrls: ['./poem-page.component.css']
})
export class PoemPageComponent implements OnInit,OnDestroy {
  poemId:number;
  poem:PoemBox;
  loading=false;
  private subscriptions: Subscription[] = [];
  constructor(private router: ActivatedRoute,
    private poemService: PoemService,
    private notificationService: NotificationService,
    private authenticationService: AuthenticationService,

    ) { }

  ngOnInit() {
    this.poemId = parseInt(this.router.snapshot.paramMap.get('poemId'));
    this.getPoem();
  }
  getPoem() {
    this.loading = true;
    this.subscriptions.push();
    this.poemService.getPoemWithPoemBox(this.poemId).subscribe(
      (response: DataResult) => {
        if (response.success) {
        this.sendNotification(NotificationType.SUCCESS, response.message);
          this.poem = response.data;      
    
          this.loading = false;
        } else {
          this.sendNotification(NotificationType.ERROR, response.message);
          this.loading = false;
        }
      },
      (errorResponse: HttpErrorResponse) => {
        this.sendNotification(
          NotificationType.ERROR,
          errorResponse.error.message
        );
        this.loading = false;
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
