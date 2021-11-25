import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { DataResult } from '../model/result/data-result';
import { Result } from '../model/result/result';
import { Category } from '../model/category';


@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  
    private host = environment.apiUrl;
  
    constructor(private http: HttpClient) {}
  
    public getCategories(): Observable<DataResult> {
      return this.http.get<DataResult>(`${this.host}/category/list`);
    }        
    public getActiveCategories(): Observable<DataResult> {
      return this.http.get<DataResult>(`${this.host}/category/list-active`);
    }
    public getCategoryByCategoryTitle(categoryTitle:string): Observable<DataResult> {
      return this.http.get<DataResult>(`${this.host}/category/category-title/${categoryTitle}`);
    }
    public getCategoryByCategoryId(categoryId:number): Observable<DataResult> {
      return this.http.get<DataResult>(`${this.host}/category/category-id/${categoryId}`);
    }
   
    
    


  }