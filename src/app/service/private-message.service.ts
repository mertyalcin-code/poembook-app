import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { DataResult } from '../model/result/data-result';
import { Result } from '../model/result/result';

@Injectable({
  providedIn: 'root'
})
export class PrivateMessageService {
  private host = environment.apiUrl;
  constructor(private http: HttpClient) { }

  public sendMessage(formData: FormData): Observable<Result> {
    return this.http.post<Result>(`${this.host}/private-message/send`, formData);
  }

  public usersAllMessagesWith(formData: FormData): Observable<DataResult> {
    return this.http.post<DataResult>(`${this.host}/private-message/list-all-messages`, formData);
  }
  public usersMessageList(username: string): Observable<DataResult> {
    return this.http.get<DataResult>(`${this.host}/private-message/list-message-list/${username}`);
  }




  public createUserFormData(fromUsername: string, toUsername: string, message: string): FormData {
    const formData = new FormData();
    formData.append('fromUsername', fromUsername);
    formData.append('toUsername', toUsername);
    formData.append('message', message);
    return formData;
  }

  public requestMessagesFormData(username: string, withUsername: string): FormData {
    const formData = new FormData();
    formData.append('username', username);
    formData.append('withUsername', withUsername);
    return formData;

  }

}
