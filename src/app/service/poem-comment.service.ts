import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Result } from '../model/result/result';

@Injectable({
  providedIn: 'root'
})
export class PoemCommentService {
  private host = environment.apiUrl;
constructor(private http: HttpClient) { }

public addComment(formData:FormData): Observable<Result> {
  return this.http.post<Result>(`${this.host}/comment/add`,formData);
}
public updateComment(formData:FormData): Observable<Result> {
  return this.http.post<Result>(`${this.host}/comment/update`,formData);
}
public deleteComment(id:number): Observable<Result> {
  return this.http.delete<Result>(`${this.host}/comment/delete/${id}`);
}


public createCommentData(poemId: number,poemCommentText:string): FormData {
  const formData = new FormData();
  formData.append('poemId', JSON.stringify(poemId));
  formData.append('poemCommentText', poemCommentText);
  return formData;
}
public editCommentData(poemCommentId:number,poemCommentText:string): FormData {
  const formData = new FormData();
  formData.append('poemCommentId', JSON.stringify(poemCommentId));
  formData.append('poemCommentText', poemCommentText);
  return formData;
}



}
