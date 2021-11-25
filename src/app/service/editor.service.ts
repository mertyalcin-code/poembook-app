import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Category } from '../model/category';
import { DataResult } from '../model/result/data-result';
import { Result } from '../model/result/result';

@Injectable({
  providedIn: 'root'
})
export class EditorService {
  private host = environment.apiUrl+"/editor";
constructor(
  private http: HttpClient,
  
  ) { }
  public addCategory(formData:FormData): Observable<Result> {
    return this.http.post<Result>(`${this.host}/category/add`,formData);
  }
  public updateCategory(formData:FormData): Observable<Result> {
    return this.http.post<Result>(`${this.host}/category/update`,formData);
  }
  public deleteCategory(formData:FormData): Observable<Result> {
    return this.http.post<Result>(`${this.host}/category/delete`,formData);
  }
  public getUsersPoemByUsername(username:string): Observable<DataResult> {
    return this.http.get<DataResult>(`${this.host}/poem/list/${username}`);
  }
  public updatePoem(formData:FormData): Observable<Result> {
    return this.http.post<Result>(`${this.host}/poem/update`,formData);
  }
  public adminUpdate(formData:FormData): Observable<Result> {
    return this.http.post<Result>(`${this.host}/poem/update`,formData);
  }
  public getAllPoems(): Observable<DataResult> {
    return this.http.get<DataResult>(`${this.host}/poem/list`);
  }
  

  public createCategoryData(loggedInUsername: string, category: Category): FormData {
    const formData = new FormData();
    formData.append('currentUsername', loggedInUsername);
    formData.append('categoryTitle', category.categoryTitle);
    formData.append('isActive', JSON.stringify(category.active)); 
    return formData;
  }
  public updateCategoryData(loggedInUsername: string,category: Category): FormData {
    const formData = new FormData();
    formData.append('currentUsername', loggedInUsername);
    formData.append('categoryId', JSON.stringify(category.categoryId));
    formData.append('newCategoryTitle', category.categoryTitle);
    formData.append('isActive', JSON.stringify(category.active)); 
    return formData;
  }
  public deleteCategoryData(loggedInUsername: string, categoryTitle: string): FormData {
    const formData = new FormData();
    formData.append('currentUsername', loggedInUsername);
    formData.append('categoryTitle', categoryTitle);
    return formData;
  }
}
