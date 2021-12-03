import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
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
import { AngularEditorConfig } from '@kolkov/angular-editor';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit, OnDestroy {
  public currentUser: User;
  public poemLoading: boolean;
  public followingsPoemsLoading: boolean;
  public followingUsers: User[] = [];
  public categories: Category[] = [];
  public followingsPoems: PoemBox[] = [];
  private subscriptions: Subscription[] = [];
  private indexStart = 0;
  private indexEnd = 5;
  constructor(
    private authenticationService: AuthenticationService,
    private notificationService: NotificationService,
    private categoryService: CategoryService,
    private poemService: PoemService
  ) {}

  ngOnInit() {
    this.currentUser = this.authenticationService.getUserFromLocalCache();
    this.getCategories();
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
    this.subscriptions.push(
      this.poemService.getFollowingsPoems(this.poemService.requestFollowingsPoemData(
    this.indexStart,
    this.indexEnd
      )).subscribe(
        (response: DataResult) => {
          if (response.success) {
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
      this.poemService.addPoem(this.poemService.createPoemData(
        this.poemTitle.value,
        this.poemContent.value,
        this.categoryTitle.value
      )).subscribe(
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
  loadMorePoem() {
    this.indexEnd = this.indexEnd + 10;
    this.getFollowingsPoems();
  }
  
  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: 'auto',
    minHeight: '150px',
    maxHeight: 'auto',
    width: 'auto',
    minWidth: '100px',
    translate: 'yes',
    enableToolbar: true,
    showToolbar: true,
    placeholder: 'Şiirinizi Buraya Yazabilirsiniz...',
    defaultParagraphSeparator: '',
    defaultFontName: '',
    defaultFontSize: '',
    fonts: [
      { class: 'arial', name: 'Arial' },
      { class: 'times-new-roman', name: 'Times New Roman' },
      { class: 'calibri', name: 'Calibri' },
      { class: 'comic-sans-ms', name: 'Comic Sans MS' },
    ],
    sanitize: true,
    toolbarPosition: 'top',
    toolbarHiddenButtons: [
      ['insertImage'],
      ['insertVideo'],
      ['backgroundColor'],
    ],
  };
  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }
}
