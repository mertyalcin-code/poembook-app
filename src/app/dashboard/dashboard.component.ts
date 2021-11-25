import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { NotificationType } from '../enum/notification-type.enum';
import { Category } from '../model/category';
import { PoemBox } from '../model/result/poemBox';
import { DataResult } from '../model/result/data-result';
import { Result } from '../model/result/result';
import { User } from '../model/user';
import { AuthenticationService } from '../service/authentication.service';
import { CategoryService } from '../service/category.service';
import { NotificationService } from '../service/notification.service';
import { PoemService } from '../service/poem.service';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit,OnDestroy {
  public user: User;
  public currentUsername: string;
  poemLoading: boolean;
  followingsPoemsLoading: boolean;
  followingUsers: User[];
  categories: Category[];
  followingsPoems: PoemBox[]; 
  private subscriptions: Subscription[] = [];
  indexStart=0
  indexEnd=5
  constructor(
    private authenticationService: AuthenticationService,
    private notificationService: NotificationService,
    private categoryService: CategoryService,
    private poemService: PoemService,
  ) {}

  ngOnInit() {
    this.getCategories();
    this.currentUsername =this.authenticationService.getUserFromLocalCache().username;
    this.getFollowingsPoems();
  }

  addPoemForm = new FormGroup({
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
  get poemTitle() {
    return this.addPoemForm.get('poemTitle');
  }
  get poemContent() {
    return this.addPoemForm.get('poemContent');
  }

  get categoryTitle() {
    return this.addPoemForm.get('categoryTitle');
  }

  clearAddPoemForm() {
    this.addPoemForm.patchValue({
      poemTitle: '',
      poemContent: '',
    });
  }

  public getFollowingsPoems() {
    this.followingsPoemsLoading = true;
    this.subscriptions.push();
    this.poemService.getFollowingsPoems(this.requestPoemData()).subscribe(
      (response: DataResult) => {
        if (response.success) {
         // this.sendNotification(NotificationType.SUCCESS, response.message);
          this.followingsPoems = response.data;        
          this.followingsPoemsLoading = false;
        } else {
          this.sendNotification(NotificationType.ERROR, response.message);
          this.followingsPoemsLoading = false;
        }
      },
      (errorResponse: HttpErrorResponse) => {
        this.sendNotification(
          NotificationType.ERROR,
          errorResponse.error.message
        );
        this.followingsPoemsLoading = false;
      }
    );
  }
  public getCategories(): void {
    this.subscriptions.push();
    this.categoryService.getCategories().subscribe(
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
  addPoem(): void {
    this.poemLoading = true;
    this.subscriptions.push(
      this.poemService.addPoem(this.createPoemData()).subscribe(
        (response: Result) => {
          if (response.success) {
            this.poemLoading = false;
            this.sendNotification(NotificationType.SUCCESS, response.message);
            this.clearAddPoemForm();
            this.getFollowingsPoems();
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
  public createPoemData(): FormData {
    const formData = new FormData();
    formData.append('currentUsername', this.currentUsername);
    formData.append('poemContent', this.addPoemForm.value.poemContent);
    formData.append('poemTitle', this.addPoemForm.value.poemTitle);
    formData.append('categoryTitle', this.addPoemForm.value.categoryTitle);

    return formData;
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

  loadMorePoem(){
    this.indexEnd=this.indexEnd+10;
    this.getFollowingsPoems();
  }

   public requestPoemData(): FormData {
    const formData = new FormData();
    formData.append('username', this.currentUsername);
    formData.append('indexStart', JSON.stringify(this.indexStart));
    formData.append('indexEnd', JSON.stringify(this.indexEnd));
    return formData;
  }
  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
