import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { NotificationType } from '../enum/notification-type.enum';
import { Category } from '../model/category';
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
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit,OnDestroy {
  public currentUsername: string;
  public poemLoading: boolean;
  public categoryPoemsLoading: boolean;
  public categories: Category[]=[];
  public categoryPoems: PoemBox[]=[];
  private subscriptions: Subscription[] = [];
  public selectedCategory:string='';
  public isReadMore = true
  public indexStart=0;
  public indexEnd=5;

  constructor(   private authenticationService: AuthenticationService,
    private notificationService: NotificationService,
    private categoryService: CategoryService,
    private router: ActivatedRoute,
    private poemService: PoemService,
  ) { }


  ngOnInit() {
    this.getCategories();
    this.currentUsername= this.authenticationService.getUserFromLocalCache().username;
    this.selectedCategory=this.router.snapshot.paramMap.get('category');
    this.getSelectedCategoriesPoems();

  }
  public getCategories(): void {
    this.subscriptions.push(
    this.categoryService.getActiveCategories().subscribe(
      (response: DataResult) => {
        if (response.success) {
          this.categories = response.data;
        } else {
          this.sendNotification(NotificationType.ERROR, response.message);
        }
      },
      (errorResponse: HttpErrorResponse) => {
        this.sendNotification(
          NotificationType.ERROR,
          errorResponse.error.message
        );
      }
    ));
  }
  public getSelectedCategoriesPoems():void{
    this.categoryPoemsLoading=true;
    console.log(this.selectedCategory,this.indexEnd,this.indexStart)
    this.subscriptions.push(
    this.poemService.getSelectedCategoriesPoems(this.categoryService.categoryPoemRequestData(
      this.selectedCategory,
      this.indexStart,
      this.indexEnd
    )).subscribe(
      (response: DataResult) => {
        if (response.success) {
          this.categoryPoems = response.data;
          this.categoryPoemsLoading=false;          

        } else {
          this.sendNotification(NotificationType.ERROR, response.message);
          this.categoryPoemsLoading=false;
        }
      },
      (errorResponse: HttpErrorResponse) => {
        this.sendNotification(
          NotificationType.ERROR,
          errorResponse.error.message
        );
        this.categoryPoemsLoading=false;
      }      
    ));
  }

  loadMorePoem():void{
    this.indexEnd=this.indexEnd+5;
    this.getSelectedCategoriesPoems();
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
