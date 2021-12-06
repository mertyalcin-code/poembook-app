import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { DataResult } from '../model/result/data-result';
import { PoemBox } from '../model/result/poemBox';
import { Result } from '../model/result/result';
import { User } from '../model/user';
import { LogService } from '../service/log.service';
import { PoemService } from '../service/poem.service';
import { TestService } from '../service/test.service';
import { UserService } from '../service/user.service';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})
export class TestComponent implements OnInit {
 
  private subscriptions: Subscription[] = []; 
  content="Deneme Şiir içeriği";
  title="Deneme Şiir Başlığı";
  categoryTitle="Epik";
  constructor(private testService:TestService,
    private poemService:PoemService,
    private userService:UserService) { }

  ngOnInit() {

  }

  test(poemContent:string,poemTitle:string,categoryTitle:string):void{    
 
    this.subscriptions.push(
      this.poemService.addPoem(this.poemService.createPoemData(poemContent,poemTitle,categoryTitle)).subscribe(
        (response: Result) => {
                
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
