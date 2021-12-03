import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { NotificationType } from '../enum/notification-type.enum';
import { Result } from '../model/result/result';
import { User } from '../model/user';
import { AuthenticationService } from '../service/authentication.service';
import { ContactService } from '../service/contact.service';
import { NotificationService } from '../service/notification.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit,OnDestroy{
  public loading: boolean;
  private subscriptions: Subscription[] = [];
  currentUser:User;
  constructor(    
    private notificationService: NotificationService,
    private contactService:ContactService,
    private authenticationService:AuthenticationService,
    ) { }

  ngOnInit() {
    this.currentUser=this.authenticationService.getUserFromLocalCache();
    if(this.currentUser!=null){
      this.contactForm.patchValue({
        firstName: this.currentUser.firstName,
        lastName: this.currentUser.lastName,
        email: this.currentUser.email,
        text: '',
      });
    }
  }
  contactForm = new FormGroup({
    firstName: new FormControl("",[Validators.required,Validators.minLength(3),Validators.maxLength(30)]),
    lastName: new FormControl("",[Validators.required,Validators.minLength(3),Validators.maxLength(30)]),
    email: new FormControl("",[Validators.required,Validators.email]),
    text: new FormControl("",[Validators.required,Validators.minLength(20),Validators.maxLength(3000)])

  })
  get firstName(){
    return this.contactForm.get("firstName")
  }
  get lastName(){
    return this.contactForm.get("lastName")
  }
  get email(){
    return this.contactForm.get("email")
  }
  get text(){
    return this.contactForm.get("text")
  }
  clearContactForm() {
    this.contactForm.patchValue({
      firstName: '',
      lastName: '',
      email: '',
      text: '',
    });
  }
  onSubmit(){
    this.loading = true;
    this.subscriptions.push(
    this.contactService.submitForm(this.contactService.submitFormData(
      this.firstName.value,
      this.lastName.value,
      this.email.value,
      this.text.value)).subscribe(
      (response: Result) => {
        if (response.success) {
          this.sendNotification(NotificationType.SUCCESS, response.message);              
          this.loading = false;
          this.clearContactForm();
          this.contactForm.markAsUntouched();
        } else {
          this.sendNotification(NotificationType.ERROR, response.message);
          this.loading = false;
        }
      },
      (errorResponse: HttpErrorResponse) => {
        this.sendNotification(
          NotificationType.ERROR,
          errorResponse.error.message
        );
        this.loading = false;
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
