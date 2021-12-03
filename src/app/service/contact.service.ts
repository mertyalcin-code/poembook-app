import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { DataResult } from '../model/result/data-result';
import { Result } from '../model/result/result';

@Injectable({
  providedIn: 'root'
})
export class ContactService {

  private host = environment.apiUrl;
  constructor(
    private http: HttpClient,

  ) { }
  public submitForm(formData: FormData): Observable<Result> {
    return this.http.post<Result>(`${this.host}/contact/submit`, formData);
  }
  public getAllForms(): Observable<DataResult> {
    return this.http.get<DataResult>(`${this.host}/contact/list`);
  }
  public deleteForm(formId: number): Observable<Result> {
    return this.http.get<Result>(`${this.host}/contact/delete/${formId}`);
  }
  public deleteAllForms(): Observable<Result> {
    return this.http.get<Result>(`${this.host}/contact/delete-all`);
  }
  public submitFormData(firstName: string, lastName: string, email: string, text: string): FormData {
    const formData = new FormData();
    formData.append('firstName', firstName);
    formData.append('lastName', lastName);
    formData.append('email', email);
    formData.append('text', text);
    return formData;
  }
}
