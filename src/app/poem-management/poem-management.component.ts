import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { BehaviorSubject, Subscription } from 'rxjs';
import { NotificationType } from 'src/app/enum/notification-type.enum';
import { Category } from 'src/app/model/category';
import { Poem } from 'src/app/model/poem';
import { DataResult } from 'src/app/model/result/data-result';
import { Result } from 'src/app/model/result/result';
import { AuthenticationService } from 'src/app/service/authentication.service';
import { CategoryService } from 'src/app/service/category.service';
import { NotificationService } from 'src/app/service/notification.service';
import { PoemService } from 'src/app/service/poem.service';
import { UserService } from 'src/app/service/user.service';
import { EditorService } from '../service/editor.service';
@Component({
  selector: 'app-poem-management',
  templateUrl: './poem-management.component.html',
  styleUrls: ['./poem-management.component.css'],
})
export class PoemManagementComponent implements OnInit,OnDestroy {
  private titleSubject = new BehaviorSubject<string>('Poems');
  searchPoem:string;  
  public titleAction$ = this.titleSubject.asObservable();
  public poems: Poem [];
  public poem: Poem;
  private currentUsername: string;
  public refreshing: boolean;
  public selectedPoem: Poem;
  public editPoem = new Poem();
  public categories:Category[];
  public allCategories:Category[];
  private subscriptions: Subscription[] = [];
  editCategory = new Category();
  constructor(
    private userService: UserService,
    private poemService: PoemService,
    private router: Router,
    private authenticationService: AuthenticationService,
    private notificationService: NotificationService,
    private categoryService:CategoryService,
    private editorService:EditorService
  ) {}

  ngOnInit(): void {
    this.currentUsername =  this.authenticationService.getUserFromLocalCache().username;
    this.getCategories();
    this.getAllCategories();
    this.getPoems();
    document.getElementById("loadAllCategories").click();
  }

  changeTitle(title: string): void {
    this.titleSubject.next(title);
  }
  onSelectPoem(selectedPoem: Poem): void {
    console.log(selectedPoem);
    this.selectedPoem = selectedPoem;
    this.clickButton('openPoemInfo');
  }
  onEditPoem(editPoem: Poem): void {
    this.editPoem = editPoem;
    this.clickButton('openPoemEdit');
  }
  onDeletePoem(poemId: number): void {
    this.subscriptions.push(
      this.poemService.deletePoem(poemId).subscribe(
        (response: Result) => {
          if (response.success) {
            this.sendNotification(NotificationType.SUCCESS, response.message);
            this.getPoems();
          } else {
            this.sendNotification(NotificationType.ERROR, response.message);
          }
        },
        (error: HttpErrorResponse) => {
          this.sendNotification(NotificationType.ERROR, error.error.message);
        }
      )
    );
  }
  onEditCategory(editCategory: Category): void {
    this.editCategory = editCategory;
    this.clickButton('openCategoryEdit');
  }
  onDeleteCategory(category:Category): void {
    this.subscriptions.push(    
      this.editorService.deleteCategory( this.editorService.deleteCategoryData(this.currentUsername,category.categoryTitle)).subscribe(
        (response: Result) => {
          if (response.success) {
            this.sendNotification(NotificationType.SUCCESS, response.message);
            this.getAllCategories();
          } else {
            this.sendNotification(NotificationType.ERROR, response.message);
          }
        },
        (error: HttpErrorResponse) => {
          this.sendNotification(NotificationType.ERROR, error.error.message);
        }
      )
    );
  }

  public onUpdatePoem(): void {
    const formData = this.editorService.updatePoemFormData(
      this.editPoem.poemId,
      this.editPoem.poemContent,
      this.editPoem.poemTitle,
      this.editPoem.category.categoryTitle,
      this.editPoem.active
    );
    this.subscriptions.push(
      this.editorService.adminUpdate(formData).subscribe(
        (response: Result) => {
          if (response.success) {
            this.clickButton('closeEditPoemModalButton');
            this.getPoems();
            this.sendNotification(NotificationType.SUCCESS, response.message);
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
      )
    );
  }
  public onUpdateCategory(): void {
    const formData = this.editorService.updateCategoryData(this.currentUsername,this.editCategory);
    this.subscriptions.push(
      this.editorService.updateCategory(formData).subscribe(
        (response: Result) => {
          if (response.success) {
            this.clickButton('closeEditCategoryModalButton');
           
            this.sendNotification(NotificationType.SUCCESS, response.message);
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
      )
    );
  }
 

  private clickButton(buttonId: string): void {
    document.getElementById(buttonId).click();
  }

  public getPoems(): void {   
    this.refreshing = true;
    this.subscriptions.push();
    this.editorService.getAllPoems().subscribe(
      (response: DataResult) => {
        if (response.success) {
          this.poems = response.data;
          //poems ?? heap mı alıyor da patlıyoz
          this.refreshing = false;
          this.sendNotification(NotificationType.SUCCESS, response.message);
        } else {
          this.sendNotification(NotificationType.ERROR, response.message);
          this.refreshing = false;
        }
      },
      (errorResponse: HttpErrorResponse) => {
        this.sendNotification(
          NotificationType.ERROR,
          errorResponse.error.message
        );
        this.refreshing = false;
      }
    );
  }
  public getCategories(): void {     
    this.subscriptions.push();
    this.categoryService.getActiveCategories().subscribe(
      (response: DataResult) => {
        if (response.success) {
          this.categories = response.data; 
  
        //  this.sendNotification(NotificationType.SUCCESS, response.message);
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
  public getAllCategories(): void {     
    this.subscriptions.push();
    this.categoryService.getCategories().subscribe(
      (response: DataResult) => {
        if (response.success) {
          this.allCategories = response.data; 
  
        //  this.sendNotification(NotificationType.SUCCESS, response.message);
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
  public addCategories():void {
  }
  public editCategories():void{
  }
  public onCreateCategory(ngForm:NgForm):void{
    this.refreshing=true;
    const formData = this.editorService.createCategoryData(this.currentUsername,ngForm.value);
    this.subscriptions.push(
      this.editorService.addCategory(formData).subscribe(
        (response: Result) => {
          if(response.success){
            this.clickButton('create-category-close');
            this.getAllCategories();           
            this.refreshing=false;
            ngForm.reset();
            this.sendNotification(NotificationType.SUCCESS, response.message);
          }
          else{
            this.sendNotification(NotificationType.ERROR, response.message);
            this.refreshing=false;
          }
        
        },
        (errorResponse: HttpErrorResponse) => {
          this.sendNotification(NotificationType.ERROR, errorResponse.message);
          this.refreshing=false;
        }
      )
      );
  }
  public saveNewCategory():void{
    this.clickButton('create-category-save');
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
