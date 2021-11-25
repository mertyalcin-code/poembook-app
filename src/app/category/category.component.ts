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
  poemLoading: boolean;
  categoryPoemsLoading: boolean;
  categories: Category[];
  categoryPoems: PoemBox[];
 
  likeButtonLoading=false;
  private subscriptions: Subscription[] = [];
  selectedCategory:string='all';
  isReadMore = true
  indexStart=0;
  indexEnd=5;

  constructor(   private authenticationService: AuthenticationService,
    private notificationService: NotificationService,
    private categoryService: CategoryService,
    private router: ActivatedRoute,
    private poemService: PoemService,
    private poemCommentService: PoemCommentService,
    private poemLikeService: PoemLikeService,) { }


  ngOnInit() {
    this.getCategories();
    this.currentUsername= this.authenticationService.getUserFromLocalCache().username;
    this.selectedCategory=this.router.snapshot.paramMap.get('category');
    this.getSelectedCategoriesPoems();
    this.indexStart=0;
    this.indexEnd=5;
  }
  public getCategories(): void {
    this.subscriptions.push();
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
    );
  }
  public getSelectedCategoriesPoems():void{
    this.categoryPoemsLoading=true;
    this.subscriptions.push();
    this.poemService.getSelectedCategoriesPoems(this.categoryPoemRequestData()).subscribe(
      (response: DataResult) => {
        if (response.success) {
          this.categoryPoems = response.data;
          this.categoryPoemsLoading=false;
          console.log(response.data);

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
    );
  }
  public categoryPoemRequestData(): FormData {
    const formData = new FormData();
    formData.append('currentUsername', this.currentUsername);
    formData.append('categoryTitle',this.selectedCategory );
    formData.append('indexStart',JSON.stringify(this.indexStart) );
    formData.append('indexEnd',JSON.stringify(this.indexEnd));
    return formData;
  }

  loadMorePoem(){
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
