import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { NotificationType } from '../enum/notification-type.enum';
import { PrivateMessage } from '../model/private-message';
import { DataResult } from '../model/result/data-result';
import { Result } from '../model/result/result';
import { User } from '../model/user';
import { AuthenticationService } from '../service/authentication.service';
import { NoticeService } from '../service/notice.service';
import { NotificationService } from '../service/notification.service';
import { PrivateMessageService } from '../service/private-message.service';

@Component({
  selector: 'app-private-message',
  templateUrl: './private-message.component.html',
  styleUrls: ['./private-message.component.css']
})
export class PrivateMessageComponent implements OnInit {
  searchUser:any;
  searchMessage:any;
  messagesLoading=false;
  sendLoading=false;
  currentUser:User;
  toUsername:string;
  newMessageUser:string;
  messageList:User[]=[];
  allMessages:PrivateMessage[]=[];
  private subscriptions: Subscription[] = []; 
  constructor(private authenticationService:AuthenticationService,
    private  privateMessageService:PrivateMessageService,
    private  notificationService:NotificationService,
    private route:ActivatedRoute,
    ) { }

  ngOnInit() {
   this.currentUser= this.authenticationService.getUserFromLocalCache();
   this.setToUser();
   this.usersAllMessagesWith();
   this.usersMessageList();
  
  }
  sendMessageForm = new FormGroup({
    message: new FormControl('', [
      Validators.required,
      Validators.minLength(1),
    ]),
  });
  clearSendMessageForm() {
    this.sendMessageForm.patchValue({
      message: '',
    });
  }
  onSelectUser(user:User){
    this.toUsername=user.username;
    this.usersAllMessagesWith();
    this.usersMessageList();
  }
  usersAllMessagesWith(){    
    this.messagesLoading = true;
    this.subscriptions.push(
      this.privateMessageService.usersAllMessagesWith(this.privateMessageService.requestMessagesFormData(this.currentUser.username,this.toUsername)).subscribe(
        (response: DataResult) => {
          if (response.success) {
            this.messagesLoading = false;
         this.allMessages= response.data;         
          //  this.sendNotification(NotificationType.SUCCESS, response.message);
         
          } else {
          //  this.sendNotification(NotificationType.ERROR, response.message);
          this.allMessages=[];
            this.messagesLoading = false;
          }
        },
        (errorResponse: HttpErrorResponse) => {
          this.sendNotification(
            NotificationType.ERROR,
            errorResponse.error.message
          );
          this.messagesLoading = false;
        }
      )
    );
  }
  usersMessageList(){    
    this.messagesLoading = true;
    this.subscriptions.push(
      this.privateMessageService.usersMessageList(this.currentUser.username).subscribe(
        (response: DataResult) => {
          if (response.success) {
            this.messagesLoading = false;
            this.messageList= response.data;  
             //  this.sendNotification(NotificationType.SUCCESS, response.message);
         
          } else {
            this.sendNotification(NotificationType.ERROR, response.message);
            this.messagesLoading = false;
          }
        },
        (errorResponse: HttpErrorResponse) => {
          this.sendNotification(
            NotificationType.ERROR,
            errorResponse.error.message
          );
          this.messagesLoading = false;
        }
      )
    );
  }
  sendMessage(){    
    this.sendLoading = true;
    this.subscriptions.push(
      this.privateMessageService.sendMessage(this.privateMessageService.createUserFormData(this.currentUser.username,this.toUsername,this.sendMessageForm.value.message)).subscribe(
        (response: Result) => {
          if (response.success) {
            this.sendLoading = false;
            this.clearSendMessageForm()
            this.usersAllMessagesWith();
            this.usersMessageList();
          //  this.sendNotification(NotificationType.SUCCESS, response.message);
          this.usersAllMessagesWith()
          } else {
            this.sendNotification(NotificationType.ERROR, response.message);
            this.sendLoading = false;
          }
        },
        (errorResponse: HttpErrorResponse) => {
          this.sendNotification(
            NotificationType.ERROR,
            errorResponse.error.message
          );
          this.sendLoading = false;
        }
      )
    );
  }  
  setToUser(){
    if(this.route.snapshot.paramMap.get('username')!=null){  
     this.toUsername=this.route.snapshot.paramMap.get('username');
    }
  }
  onSendToNewUser():void{
    this.toUsername=this.newMessageUser;
    this.usersAllMessagesWith();
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
