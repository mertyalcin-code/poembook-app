import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthenticationGuard } from './guard/authentication.guard';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { RegisterSuccessComponent } from './register-success/register-success.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PoemManagementComponent } from 'src/app/poem-management/poem-management.component';
import { UserManagementComponent } from 'src/app/user-management/user-management.component';
import { AdminGuard } from './guard/admin.guard';
import { EditorGuard } from './guard/editor.guard';
import { UserComponent } from './user/user.component';
import { MyAccountComponent } from './my-account/my-account.component';
import { CategoryComponent } from './category/category.component';
import { RandomPoemComponent } from './random-poem/random-poem.component';
import { TestComponent } from './test/test.component';
import { MostCommentComponent } from './populer/most-comment/most-comment.component';
import { MostLikedComponent } from './populer/most-liked/most-liked.component';
import { SearchPoemsComponent } from './search-poems/search-poems.component';
import { PoemPageComponent } from './poem-page/poem-page.component';
import { PrivateMessageComponent } from './private-message/private-message.component';
import { ForgetPasswordComponent } from './forget-password/forget-password.component';
import { PasswordResetComponent } from './forget-password/password-reset/password-reset.component';

const routes: Routes = [
  {path: 'login',component:LoginComponent},
  {path: 'forget-password',component:ForgetPasswordComponent},
  {path: 'forget-password/code/:code',component:PasswordResetComponent},
  {path: 'register',component:RegisterComponent},
  {path: 'register-success',component:RegisterSuccessComponent},
  {path: 'test',component:TestComponent},
  {path: 'home',component:DashboardComponent,canActivate: [AuthenticationGuard] },
  {path: 'message',component:PrivateMessageComponent,canActivate: [AuthenticationGuard]},
  {path: 'message/:username',component:PrivateMessageComponent,canActivate: [AuthenticationGuard]},
  {path: 'random',component:RandomPoemComponent,canActivate: [AuthenticationGuard] },
  {path: 'most-comment',component:MostCommentComponent,canActivate: [AuthenticationGuard] },
  {path: 'most-liked',component:MostLikedComponent,canActivate: [AuthenticationGuard] },
  {path: 'poem/search',component:SearchPoemsComponent,canActivate: [AuthenticationGuard] },
  {path: 'user/:username',component:UserComponent,canActivate: [AuthenticationGuard] },
  {path: 'categories/:category',component:CategoryComponent,canActivate: [AuthenticationGuard] },
  {path: 'poem/:poemId',component:PoemPageComponent,canActivate: [AuthenticationGuard] },
  {path: 'myaccount',component:MyAccountComponent,canActivate: [AuthenticationGuard] },
  {path: 'admin/user/management',component:UserManagementComponent,canActivate: [AdminGuard] }, 
  {path: 'admin/poem/management',component:PoemManagementComponent,canActivate: [EditorGuard] }, 
  {path: '', redirectTo : 'login',pathMatch:'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
