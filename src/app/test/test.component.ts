import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { DataResult } from '../model/result/data-result';
import { PoemBox } from '../model/result/poemBox';
import { LogService } from '../service/log.service';
import { PoemService } from '../service/poem.service';
import { TestService } from '../service/test.service';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})
export class TestComponent implements OnInit {
 
  private subscriptions: Subscription[] = []; 


  constructor(private testService:TestService) { }

  ngOnInit() {
    this.test()
  }
  test():void{    
 
    this.subscriptions.push(
      this.testService.test().subscribe(
        (response: Date) => {
                
            console.log(response)
   
          //  this.sendNotification(NotificationType.SUCCESS, response.message);            
     

       
    
        },
        (errorResponse: HttpErrorResponse) => {
         console.log(errorResponse.message)
        }
      )
    );
  }
}
