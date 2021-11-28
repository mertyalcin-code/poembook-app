import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { DataResult } from '../model/result/data-result';
import { Result } from '../model/result/result';

@Injectable({
  providedIn: 'root'
})
export class NoticeService {
  private host = environment.apiUrl;
constructor(private http: HttpClient) { }

public delete(formData:FormData): Observable<Result> {
  return this.http.post<Result>(`${this.host}/notice/delete`,formData);
}
public deleteAll(formData:FormData): Observable<Result> {
  return this.http.post<Result>(`${this.host}/notice/delete-all`,formData);
}
public listAll(formData:FormData): Observable<DataResult> {
  return this.http.post<DataResult>(`${this.host}/notice/list-all`,formData);
}
public deleteNoticeData(currentUsername: string, noticeId:number): FormData {
  const formData = new FormData();   
  formData.append('currentUsername', currentUsername);
  formData.append('noticeId', JSON.stringify(noticeId));
  return formData;
}
public deleteAllNoticeData(currentUsername: string, username:string): FormData {
  const formData = new FormData();   
  formData.append('currentUsername', currentUsername);
  formData.append('username', username);
  return formData;
}
public listAllNoticeData(currentUsername: string, username:string): FormData {
  const formData = new FormData();   
  formData.append('currentUsername', currentUsername);
  formData.append('username', username);
  return formData;
}
}

