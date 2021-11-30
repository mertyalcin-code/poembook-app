import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthenticationService } from './service/authentication.service';
import { UserService } from './service/user.service';
import { AuthInterceptor } from './interceptor/auth.interceptor';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NotificationModule } from './notification.module';
import { NotificationService } from './service/notification.service';
import { AuthenticationGuard } from './guard/authentication.guard';
import { LoginComponent } from './login/login.component';
import { UserComponent } from './user/user.component';
import { RegisterComponent } from './register/register.component';
import { RegisterSuccessComponent } from './register-success/register-success.component';
import { FooterComponent } from './footer/footer.component';
import { NavbarComponent } from './navbar/navbar.component';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PoemManagementComponent } from 'src/app/poem-management/poem-management.component';
import { UserManagementComponent } from './user-management/user-management.component';
import { MyAccountComponent } from './my-account/my-account.component';
import { CategoryComponent } from './category/category.component';
import { RandomPoemComponent } from './random-poem/random-poem.component';
import { TestComponent } from './test/test.component';
import { PoemBoxComponent } from './poem-box/poem-box.component';
import { MostLikedComponent } from './populer/most-liked/most-liked.component';
import { MostCommentComponent } from './populer/most-comment/most-comment.component';
import { SearchPoemsComponent } from './search-poems/search-poems.component';
import { PoemPageComponent } from './poem-page/poem-page.component';
import { PrivateMessageComponent } from './private-message/private-message.component';
import { ForgetPasswordComponent } from './forget-password/forget-password.component';
import { PasswordResetComponent } from './forget-password/password-reset/password-reset.component';





@NgModule({
  declarations: [																								
    AppComponent,
      LoginComponent,
      UserComponent,
      UserComponent,
      RegisterComponent,
      RegisterSuccessComponent,
      FooterComponent,
      NavbarComponent,        
      UserComponent,
      DashboardComponent,
      PoemManagementComponent,
      UserManagementComponent,
      MyAccountComponent,
      CategoryComponent,
      RandomPoemComponent,
      TestComponent,
      PoemBoxComponent,
      MostLikedComponent,
      MostCommentComponent,
      SearchPoemsComponent,
      PoemPageComponent,     
      PrivateMessageComponent,
      ForgetPasswordComponent,
      PasswordResetComponent,
   ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    NotificationModule,
    ReactiveFormsModule,
    AngularEditorModule,    

  ],
  providers: [
    AuthenticationService,
    UserService,
    {provide: HTTP_INTERCEPTORS,useClass:AuthInterceptor,multi:true},
    AuthenticationGuard,
    NotificationService

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
