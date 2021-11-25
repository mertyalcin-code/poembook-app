import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { NotificationType } from '../enum/notification-type.enum';
import { DataResult } from '../model/result/data-result';
import { PoemBox } from '../model/result/poemBox';
import { Result } from '../model/result/result';
import { AuthenticationService } from '../service/authentication.service';
import { NotificationService } from '../service/notification.service';
import { PoemCommentService } from '../service/poem-comment.service';
import { PoemLikeService } from '../service/poem-like.service';
import { PoemService } from '../service/poem.service';


@Component({
  selector: 'app-poem-box',
  templateUrl: './poem-box.component.html',
  styleUrls: ['./poem-box.component.css']
})
export class PoemBoxComponent implements OnInit,OnDestroy {
  @Input() poem: PoemBox;
  public currentUsername: string;
  poemLoading: boolean;  
  commentLoading: boolean;
  likeButtonLoading=false;
  private subscriptions: Subscription[] = []; 
  showComment : Map<number,boolean>;

  constructor( private authenticationService: AuthenticationService,
    private notificationService: NotificationService,  
    private poemService: PoemService,
    private poemCommentService: PoemCommentService,
    private poemLikeService: PoemLikeService,) { }

  ngOnInit() {
    this.currentUsername= this.authenticationService.getUserFromLocalCache().username;
    this.getpoem();
  }
  
  getpoem():void{    
    this.poemLoading = true;
    this.subscriptions.push(
      this.poemService.getPoemWithPoemBox(this.poem.poemId).subscribe(
        (response: DataResult) => {
          if (response.success) {
            this.poem=response.data;
            this.poemLoading = false;
          //  this.sendNotification(NotificationType.SUCCESS, response.message);            
          } else {
            this.sendNotification(NotificationType.ERROR, response.message);
            this.poemLoading = false;
          }
        },
        (errorResponse: HttpErrorResponse) => {
          this.sendNotification(
            NotificationType.ERROR,
            errorResponse.error.message
          );
          this.poemLoading = false;
        }
      )
    );
  }
 
likePoem(poemId:number){    
  this.likeButtonLoading = true;
  this.subscriptions.push(
    this.poemLikeService.likePoem(this.likePoemData(poemId)).subscribe(
      (response: Result) => {
        if (response.success) {
          this.likeButtonLoading = false;
        //  this.sendNotification(NotificationType.SUCCESS, response.message);
        this.getpoem()
        } else {
          this.sendNotification(NotificationType.ERROR, response.message);
          this.likeButtonLoading = false;
        }
      },
      (errorResponse: HttpErrorResponse) => {
        this.sendNotification(
          NotificationType.ERROR,
          errorResponse.error.message
        );
        this.likeButtonLoading = false;
      }
    )
  );
}
unlikePoem(poemId:number){    
  this.likeButtonLoading = true;
  this.subscriptions.push(
    this.poemLikeService.unlikePoem(this.unlikePoemData(poemId)).subscribe(
      (response: Result) => {
        if (response.success) {
          this.likeButtonLoading = false;
        //  this.sendNotification(NotificationType.SUCCESS, response.message);
        this.getpoem()
        } else {
          this.sendNotification(NotificationType.ERROR, response.message);
          this.likeButtonLoading = false;
        }
      },
      (errorResponse: HttpErrorResponse) => {
        this.sendNotification(
          NotificationType.ERROR,
          errorResponse.error.message
        );
        this.likeButtonLoading = false;
      }
    )
  );
}
public likePoemData(poemId: number): FormData {
  const formData = new FormData();
  formData.append('currentUsername', this.currentUsername);
  formData.append('poemId', JSON.stringify(poemId));
  return formData;
}
public unlikePoemData(poemId: number): FormData {
  const formData = new FormData();
  formData.append('currentUsername', this.currentUsername);
  formData.append('poemId', JSON.stringify(poemId));
  return formData;
}

addCommentForm = new FormGroup({
  comment: new FormControl('', [
    Validators.required,
    Validators.minLength(1),
  ]),
});
get comment() {
  return this.addCommentForm.get('comment');
}
clearAddCommentForm() {
  this.addCommentForm.patchValue({
    comment: '',
  });
}
addComment(poemId: number): void {
  this.commentLoading = true;
  this.subscriptions.push(
    this.poemCommentService
      .addComment(this.createCommentData(poemId))
      .subscribe(
        (response: Result) => {
          if (response.success) {
            this.commentLoading = false;
            this.sendNotification(NotificationType.SUCCESS, response.message);
            this.clearAddCommentForm();
            this.getpoem();
          } else {
            this.sendNotification(NotificationType.ERROR, response.message);
            this.commentLoading = false;
          }
        },
        (errorResponse: HttpErrorResponse) => {
          this.sendNotification(
            NotificationType.ERROR,
            errorResponse.error.message
          );
          this.commentLoading = false;
        }
      )
  );
}
deleteComment(poemCommentId): void {
  this.commentLoading = true;
  this.subscriptions.push(
    this.poemCommentService
      .deleteComment(this.deleteCommentData(poemCommentId))
      .subscribe(
        (response: Result) => {
          if (response.success) {
            this.commentLoading = false;
            this.sendNotification(NotificationType.SUCCESS, response.message);
            this.getpoem()
          } else {
            this.sendNotification(NotificationType.ERROR, response.message);
            this.commentLoading = false;
          }
        },
        (errorResponse: HttpErrorResponse) => {
          this.sendNotification(
            NotificationType.ERROR,
            errorResponse.error.message
          );
          this.commentLoading = false;
        }
      )
  );
}

public deleteCommentData(poemCommentId: number): FormData {
  const formData = new FormData();
  formData.append('username', this.currentUsername);
  formData.append('poemCommentId', JSON.stringify(poemCommentId));
  return formData;
}


public createCommentData(poemId: number): FormData {
  const formData = new FormData();
  formData.append('username', this.currentUsername);
  formData.append('poemId', JSON.stringify(poemId));
  formData.append('poemCommentText', this.addCommentForm.value.comment);
  return formData;
}
deletePoem(poemId: number): void {
  this.poemLoading = true;
  this.subscriptions.push(
    this.poemService.deletePoem(this.deletePoemData(poemId)).subscribe(
      (response: Result) => {
        if (response.success) {
          this.poemLoading = false;
          this.sendNotification(NotificationType.SUCCESS, response.message);
          this.getpoem()
        } else {
          this.sendNotification(NotificationType.ERROR, response.message);
          this.poemLoading = false;
        }
      },
      (errorResponse: HttpErrorResponse) => {
        this.sendNotification(
          NotificationType.ERROR,
          errorResponse.error.message
        );
        this.poemLoading = false;
      }
    )
  );
}
public deletePoemData(poemId: number): FormData {
  const formData = new FormData();
  formData.append('currentUsername', this.currentUsername);
  formData.append('poemId', JSON.stringify(poemId));
  return formData;
}

refresh(){
  window.location.reload();

}
float2int(double:number){
  return Math.floor(double);
}

showAllComment(poemId:number){
  this.showComment.set(poemId,true);

}
showLessComment(poemId:number){
  this.showComment.set(poemId,false);
  
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