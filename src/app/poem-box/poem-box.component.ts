import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { NotificationType } from '../enum/notification-type.enum';
import { Category } from '../model/category';
import { Poem } from '../model/poem';
import { DataResult } from '../model/result/data-result';
import { PoemBox } from '../model/result/poemBox';
import { Result } from '../model/result/result';
import { User } from '../model/user';
import { AuthenticationService } from '../service/authentication.service';
import { CategoryService } from '../service/category.service';
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
  public currentUser: User;
  poemLoading: boolean;  
  loading: boolean;
  commentLoading: boolean;  
  likeButtonLoading=false;
  private subscriptions: Subscription[] = []; 
  categories:Category[];
  showComment : Map<number,boolean>;
  editCommentStatus=false;
  editPoemStatus= false;
  editPoem= new Poem();
  editCommentId:number;
  updateCommentLoading=false;

  constructor( private authenticationService: AuthenticationService,
    private notificationService: NotificationService,  
    private poemService: PoemService,
    private poemCommentService: PoemCommentService,
    private poemLikeService: PoemLikeService,
    private categoryService: CategoryService,
    ) { }

  ngOnInit() {
    this.currentUsername= this.authenticationService.getUserFromLocalCache().username;
    this.currentUser= this.authenticationService.getUserFromLocalCache();
    this.getpoem();
    this.getCategories();
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
  public getCategories(): void {
    this.subscriptions.push();
    this.categoryService.getCategories().subscribe(
      (response: DataResult) => {
        if (response.success) {
          this.categories = response.data;
        } else {
       
        }
      },
      (errorResponse: HttpErrorResponse) => {        
      }
    );
  }
 
  onEditPoem(poemId:number):void{
    this.editPoemStatus=true;
    this.editPoemForm.patchValue({
      poemTitle: this.poem.poemTitle,
      poemContent: this.poem.poemContent,
      categoryTitle: this.poem.categoryTitle,
    });
  }
  onEditComment(poemCommentId:number,poemCommentText:string):void{
    this.editCommentStatus=true;
    this.editCommentId=poemCommentId;
    this.editCommentForm.patchValue({      
     comment: poemCommentText
   
    });
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

editCommentForm = new FormGroup({
  comment: new FormControl('', [
    Validators.required,
    Validators.minLength(1),
  ]),
});
editPoemForm = new FormGroup({
  poemTitle: new FormControl('', [
    Validators.required,
    Validators.minLength(3),
  ]),
  poemContent: new FormControl('', [
    Validators.required,
    Validators.minLength(3),
  ]),
  categoryTitle: new FormControl('', [Validators.required]),
});

get comment() {
  return this.addCommentForm.get('comment');
}
get poemTitle() {
  return this.editPoemForm.get('poemTitle');
}
get poemContent() {
  return this.editPoemForm.get('poemContent');
}
get categoryTitle() {
  return this.editPoemForm.get('categoryTitle');
}

clearAddCommentForm() {
  this.addCommentForm.patchValue({
    comment: '',
  });
}
clearEditPoemForm() {
  this.editPoemForm.patchValue({
    poemTitle: '',
    poemContent: '',
    categoryTitle: '',
  });
}
clearEditCommentForm() {
  this.editPoemForm.patchValue({
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
updateComment(): void { 
  this.updateCommentLoading=true;
  this.editCommentStatus=true;
  this.subscriptions.push(
    this.poemCommentService
      .updateComment(this.editCommentData())
      .subscribe(
        (response: Result) => {
          if (response.success) {
            this.updateCommentLoading=false;
            this.editCommentStatus=false;
            this.sendNotification(NotificationType.SUCCESS, response.message);
            this.clearEditCommentForm();
            this.getpoem();
            this.editCommentId=null;
          } else {
            this.sendNotification(NotificationType.ERROR, response.message);
            this.updateCommentLoading=false;
          }
        },
        (errorResponse: HttpErrorResponse) => {
          this.sendNotification(
            NotificationType.ERROR,
            errorResponse.error.message
          );
          this.updateCommentLoading=false;
        }
      )
  );
}
updatePoem(poemId: number): void {
  this.loading = true;
  this.subscriptions.push(
    this.poemService
      .updatePoem(this.updatePoemData(poemId))
      .subscribe(
        (response: Result) => {
          if (response.success) {
            this.loading = false;
            this.sendNotification(NotificationType.SUCCESS, response.message);
            this.clearEditPoemForm();
            this.getpoem();
            this.editPoemStatus=false;
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
public editCommentData(): FormData {
  const formData = new FormData();
  formData.append('currentUsername', this.currentUsername);
  formData.append('poemCommentId', JSON.stringify(this.editCommentId));
  formData.append('poemCommentText', this.editCommentForm.value.comment);
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
public updatePoemData(poemId: number): FormData {
  const formData = new FormData();
  formData.append('currentUsername', this.currentUsername);
  formData.append('poemId', JSON.stringify(poemId));
  formData.append('poemTitle',this.poemTitle.value);
  formData.append('poemContent',this.poemContent.value);
  formData.append('categoryTitle',this.categoryTitle.value);
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