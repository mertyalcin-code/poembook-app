import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { NotificationType } from '../enum/notification-type.enum';
import { Category } from '../model/category';
import { DataResult } from '../model/result/data-result';
import { PoemBox } from '../model/result/poemBox';
import { Result } from '../model/result/result';
import { AuthenticationService } from '../service/authentication.service';
import { CategoryService } from '../service/category.service';
import { NotificationService } from '../service/notification.service';
import { PoemCommentService } from '../service/poem-comment.service';
import { PoemLikeService } from '../service/poem-like.service';
import { PoemService } from '../service/poem.service';

@Component({
  selector: 'app-random-poem',
  templateUrl: './random-poem.component.html',
  styleUrls: ['./random-poem.component.css']
})
export class RandomPoemComponent implements OnInit, OnDestroy {
  public currentUsername: string;
  randomPoemLoading: boolean;
  randomPoem: PoemBox;
  private subscriptions: Subscription[] = [];
  constructor(private authenticationService: AuthenticationService,
    private notificationService: NotificationService,
    private poemService: PoemService,
  ) { }

  ngOnInit() {
    this.currentUsername = this.authenticationService.getUserFromLocalCache().username;
    this.getRandomPoem();
  }

  getRandomPoem(): void {
    this.randomPoemLoading = true;
    this.subscriptions.push(
      this.poemService.getRandomPoem().subscribe(
        (response: DataResult) => {
          if (response.success) {
            this.randomPoem = response.data;
            this.randomPoemLoading = false;
            //  this.sendNotification(NotificationType.SUCCESS, response.message);            
          } else {
            this.sendNotification(NotificationType.ERROR, response.message);
            this.randomPoemLoading = false;
          }
        },
        (errorResponse: HttpErrorResponse) => {
          this.sendNotification(
            NotificationType.ERROR,
            errorResponse.error.message
          );
          this.randomPoemLoading = false;
        }
      )
    );
  }

  refresh() {
    window.location.reload();

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