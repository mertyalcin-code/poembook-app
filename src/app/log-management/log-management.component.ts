import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { NotificationType } from '../enum/notification-type.enum';
import { Log } from '../model/log';
import { DataResult } from '../model/result/data-result';
import { Result } from '../model/result/result';
import { AuthenticationService } from '../service/authentication.service';
import { LogService } from '../service/log.service';
import { NotificationService } from '../service/notification.service';

@Component({
  selector: 'app-log-management',
  templateUrl: './log-management.component.html',
  styleUrls: ['./log-management.component.css']
})
export class LogManagementComponent implements OnInit,OnDestroy {
  logs:Log[]=[];
  loading=false;
  logTypes:string[]=[];
  searchText:string;
  private subscriptions: Subscription[] = []; 
  constructor(
    private authenticationService:AuthenticationService,
    private logService:LogService,
    private notificationService:NotificationService
    ) { }


  ngOnInit() {
    this.getAllLogs();
    this.getLogTypes();
  }
  changeLogType(logType:string):void{
    this.getLogWithLogType(logType);
  }
  getAllLogs():void{    
    this.loading=true;
    this.subscriptions.push(
      this.logService.allLogs().subscribe(
        (response: DataResult) => {
          if (response.success) {         
           this.logs=response.data;   
           this.loading=false;
          this.sendNotification(NotificationType.SUCCESS, response.message);            
          } else {
            this.logs=[];
            this.sendNotification(NotificationType.ERROR, response.message);   
            this.loading=false;    
       
          }
        },
        (errorResponse: HttpErrorResponse) => {
          this.sendNotification(NotificationType.ERROR, errorResponse.error.message);   
          this.loading=false;
        }
      )
    );
  }
  getLogWithLogType(logType:string):void{    
    this.loading=true;
    this.subscriptions.push(
      this.logService.getLogWithLogType(logType).subscribe(
        (response: DataResult) => {
          if (response.success) {         
           this.logs=response.data;   
           this.loading=false;
          this.sendNotification(NotificationType.SUCCESS, response.message);            
          } else {
            this.sendNotification(NotificationType.ERROR, response.message);   
            this.loading=false;    
       
          }
        },
        (errorResponse: HttpErrorResponse) => {
          this.sendNotification(NotificationType.ERROR, errorResponse.error.message);   
          this.loading=false;
        }
      )
    );
  }
  getLogTypes():void{

    this.subscriptions.push(
      this.logService.getLogTypes().subscribe(
        (response: DataResult) => {
          if (response.success) {         
           this.logTypes=response.data;   
            console.log(response.data)
        //  this.sendNotification(NotificationType.SUCCESS, response.message);            
          } else {
            this.sendNotification(NotificationType.ERROR, response.message);   
                      }
        },
        (errorResponse: HttpErrorResponse) => {
          this.sendNotification(NotificationType.ERROR, errorResponse.error.message);   
   
        }
      )
    );
  }  
  deleteAllLogs():void{

    this.subscriptions.push(
      this.logService.deleteAllLogs().subscribe(
        (response: Result) => {
          if (response.success) { 
         this.sendNotification(NotificationType.SUCCESS, response.message);  
         this.getAllLogs();          
          } else {
            this.sendNotification(NotificationType.ERROR, response.message);   
                      }
        },
        (errorResponse: HttpErrorResponse) => {
          this.sendNotification(NotificationType.ERROR, errorResponse.error.message);   
   
        }
      )
    );
  }
  deleteByType(logType:string):void{

    this.subscriptions.push(
      this.logService.deleteByType(logType).subscribe(
        (response: Result) => {
          if (response.success) { 
            this.getAllLogs();  
         this.sendNotification(NotificationType.SUCCESS, response.message);            
          } else {
            this.sendNotification(NotificationType.ERROR, response.message);   
                      }
        },
        (errorResponse: HttpErrorResponse) => {
          this.sendNotification(NotificationType.ERROR, errorResponse.error.message);   
   
        }
      )
    );
  }
  deleteAllLogsExceptThisWeek():void{

    this.subscriptions.push(
      this.logService.deleteAllLogsExceptThisWeek().subscribe(
        (response: Result) => {
          if (response.success) { 
            this.getAllLogs();  
         this.sendNotification(NotificationType.SUCCESS, response.message);            
          } else {
            this.sendNotification(NotificationType.ERROR, response.message);   
                      }
        },
        (errorResponse: HttpErrorResponse) => {
          this.sendNotification(NotificationType.ERROR, errorResponse.error.message);   
   
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
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
