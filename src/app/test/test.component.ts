import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { DataResult } from '../model/result/data-result';
import { PoemBox } from '../model/result/poemBox';
import { PoemService } from '../service/poem.service';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})
export class TestComponent implements OnInit {
  poem :PoemBox;
  private subscriptions: Subscription[] = []; 


  constructor(private poemService:PoemService) { }

  ngOnInit() {
    this.getpoem()
  }
  getpoem():void{    
 
    this.subscriptions.push(
      this.poemService.getPoemWithPoemBox(1).subscribe(
        (response: DataResult) => {
          if (response.success) {
            this.poem=response.data;
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
