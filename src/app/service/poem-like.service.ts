import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { DataResult } from '../model/result/data-result';
import { Result } from '../model/result/result';

@Injectable({
  providedIn: 'root'
})
export class PoemLikeService {
  private host = environment.apiUrl;

  constructor(private http: HttpClient) {}

  public likePoem(formData:FormData): Observable<Result> {
    return this.http.post<Result>(`${this.host}/like-poem/like`,formData);
  }
  public unlikePoem(formData:FormData): Observable<Result> {
    return this.http.post<Result>(`${this.host}/like-poem/unlike`,formData);
  }
}