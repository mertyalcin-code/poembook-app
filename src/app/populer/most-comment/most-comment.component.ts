import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { NotificationType } from 'src/app/enum/notification-type.enum';
import { DataResult } from 'src/app/model/result/data-result';
import { PoemBox } from 'src/app/model/result/poemBox';
import { ProfileUser } from 'src/app/model/result/profileUser';
import { AuthenticationService } from 'src/app/service/authentication.service';
import { FollowService } from 'src/app/service/follow.service';
import { NotificationService } from 'src/app/service/notification.service';
import { PoemService } from 'src/app/service/poem.service';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-most-comment',
  templateUrl: './most-comment.component.html',
  styleUrls: ['./most-comment.component.css']
})
export class MostCommentComponent implements OnInit,OnDestroy {
  public currentUsername: string;
  private subscriptions: Subscription[] = [];
  public poems: PoemBox[]=[];
  public next=5;
  public loading=false;
  constructor(
    private authenticationService: AuthenticationService,
    private notificationService: NotificationService,  
    private router: ActivatedRoute,
    private poemService: PoemService,
    private userService: UserService,
    private followerService: FollowService, 
  ) { }
  ngOnInit() {
    this.currentUsername =this.authenticationService.getUserFromLocalCache().username;  
    this.list20MostCommentsPoems();   
    
  }

  list20MostCommentsPoems(): void {
    this.loading=true;
    this.subscriptions.push();
    this.poemService.list20MostCommentsPoems().subscribe(
      (response: DataResult) => {
        if (response.success) {
          this.poems = response.data;
          this.loading=false;
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
  public showPopulerPoems(min:number,next:number){
    
    return this.poems.slice(min,next)
   }
   public increaseNext(){
     if(this.next<(this.poems.length-5)){
       this.next=this.next+5;
     }
     else{
       this.next=this.poems.length;
     }
     
    }
  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}

