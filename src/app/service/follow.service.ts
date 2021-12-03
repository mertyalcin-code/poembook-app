import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { DataResult } from '../model/result/data-result';
import { Result } from '../model/result/result';

@Injectable({
  providedIn: 'root'
})
export class FollowService {
  private host = environment.apiUrl;
  constructor(private http: HttpClient) { }

  public isFollowing(formData: FormData): Observable<Result> {
    return this.http.post<Result>(`${this.host}/follower/isfollowing`, formData);
  }
  public follow(formData: FormData): Observable<Result> {
    return this.http.post<Result>(`${this.host}/follower/follow`, formData);
  }
  public unfollow(formData: FormData): Observable<Result> {
    return this.http.post<Result>(`${this.host}/follower/unfollow`, formData);
  }

  public createIsFollowingFormData(currentUsername: string, toUsername: string): FormData {
    const formData = new FormData();
    formData.append('fromUsername', currentUsername);
    formData.append('toUsername', toUsername);
    return formData;
  }
  public createFollowFormData(currentUsername: string, toUsername: string): FormData {
    const formData = new FormData();
    formData.append('fromUsername', currentUsername);
    formData.append('toUsername', toUsername);
    return formData;
  }
  public createUnfollowFormData(currentUsername: string, toUsername: string): FormData {
    const formData = new FormData();
    formData.append('fromUsername', currentUsername);
    formData.append('toUsername', toUsername);
    return formData;
  }

}
