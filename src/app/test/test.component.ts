import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { DataResult } from '../model/result/data-result';
import { PoemBox } from '../model/result/poemBox';
import { LogService } from '../service/log.service';
import { PoemService } from '../service/poem.service';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})
export class TestComponent implements OnInit {
 
  private subscriptions: Subscription[] = []; 


  constructor(private logService:LogService) { }

  ngOnInit() {
    this.getpoem()
  }
  getpoem():void{    
 
    this.subscriptions.push(
      this.logService.allLogs().subscribe(
        (response: DataResult) => {
          if (response.success) {         
            console.log(response.data)
   
          //  this.sendNotification(NotificationType.SUCCESS, response.message);            
          } else {

       
          }
        },
        (errorResponse: HttpErrorResponse) => {
         
        }
      )
    );
  }
}
