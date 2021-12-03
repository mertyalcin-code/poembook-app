import { HttpErrorResponse } from '@angular/common/http';
import { Route } from '@angular/compiler/src/core';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
  ActivatedRoute,
  ActivatedRouteSnapshot,
  Router,
} from '@angular/router';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { NotificationType } from '../enum/notification-type.enum';

import { DataResult } from '../model/result/data-result';
import { PoemBox } from '../model/result/poemBox';
import { ProfileUser } from '../model/result/profileUser';
import { Result } from '../model/result/result';
import { AuthenticationService } from '../service/authentication.service';
import { CategoryService } from '../service/category.service';
import { FollowService } from '../service/follow.service';
import { NotificationService } from '../service/notification.service';
import { PoemCommentService } from '../service/poem-comment.service';
import { PoemLikeService } from '../service/poem-like.service';
import { PoemService } from '../service/poem.service';
import { UserService } from '../service/user.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'],
})
export class UserComponent implements OnInit, OnDestroy {

  public profileUsername: string;
  public followerSearch: any;
  public followingSearch: any;
  public profileUser = new ProfileUser;
  public currentUsername: string;
  public isFollowing: boolean;
  public followLoading: boolean;
  private subscriptions: Subscription[] = [];
  public profilePoems: PoemBox[] = [];
  public profilePoemsLoading: boolean;
  public indexStart = 0;
  public indexEnd = 5;

  constructor(
    private authenticationService: AuthenticationService,
    private notificationService: NotificationService,
    private router: ActivatedRoute,
    private urlRouter: Router,
    private poemService: PoemService,
    private userService: UserService,
    private followerService: FollowService,
  ) { }

  ngOnInit() {
    this.currentUsername = this.authenticationService.getUserFromLocalCache().username;
    this.profileUsername = this.router.snapshot.paramMap.get('username');
    this.getUserProfile(this.profileUsername);
    this.checkFollowing();
    this.getProfilePoems();

  }

  getUserProfile(username: string): void {
    this.subscriptions.push(
      this.userService.getUserProfile(username).subscribe(
        (response: DataResult) => {
          if (response.success) {
            this.profileUser = response.data;
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
      ));
  }
  getProfilePoems() {
    this.profilePoemsLoading = true;
    this.subscriptions.push(
      this.poemService.getProfilePoemsByUsername(this.poemService.requestPoemData(
        this.profileUsername,
        this.indexStart,
        this.indexEnd
      )).subscribe(
        (response: DataResult) => {
          if (response.success) {
            // this.sendNotification(NotificationType.SUCCESS, response.message);
            this.profilePoems = response.data;

            this.profilePoemsLoading = false;
          } else {
            this.sendNotification(NotificationType.ERROR, response.message);
            this.profilePoemsLoading = false;
          }
        },
        (errorResponse: HttpErrorResponse) => {
          this.sendNotification(
            NotificationType.ERROR,
            errorResponse.error.message
          );
          this.profilePoemsLoading = false;
        }
      ));
  }
  follow(username: string): void {
    this.followLoading = true;
    this.subscriptions.push(
      this.followerService
        .follow(
          this.followerService.createFollowFormData(
            this.currentUsername,
            username
          )
        )
        .subscribe(
          (response: Result) => {
            if (response.success) {
              this.checkFollowing();
              this.followLoading = false;
              this.sendNotification(NotificationType.SUCCESS, response.message);
            } else {
              this.sendNotification(NotificationType.ERROR, response.message);
              this.followLoading = false;
            }
          },
          (errorResponse: HttpErrorResponse) => {
            this.sendNotification(
              NotificationType.ERROR,
              errorResponse.error.message
            );
            this.followLoading = false;
          }
        ));
  }
  unfollow(username: string): void {
    this.followLoading = true;
    this.subscriptions.push(
      this.followerService
        .unfollow(
          this.followerService.createUnfollowFormData(
            this.currentUsername,
            username
          )
        )
        .subscribe(
          (response: Result) => {
            if (response.success) {
              this.checkFollowing();
              this.followLoading = false;
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
            this.followLoading = false;
          }
        ));
  }
  checkFollowing(): void {
    this.subscriptions.push(
      this.followerService
        .isFollowing(
          this.followerService.createIsFollowingFormData(
            this.currentUsername,
            this.profileUsername
          )
        )
        .subscribe(
          (response: Result) => {
            if (response.success) {
              this.isFollowing = true;
            } else {
              this.isFollowing = false;
            }
          },
          (errorResponse: HttpErrorResponse) => {
            this.isFollowing = false;
          }
        ));
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
    this.getProfilePoems();
  }


  routeMessagePage() {
    this.urlRouter.navigateByUrl('/message/' + this.profileUser.username)
  }
  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
