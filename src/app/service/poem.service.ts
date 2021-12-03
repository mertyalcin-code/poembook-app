import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { DataResult } from '../model/result/data-result';
import { Result } from '../model/result/result';
import { Poem } from '../model/poem';

@Injectable({
  providedIn: 'root'
})
export class PoemService {
  private host = environment.apiUrl;

  constructor(private http: HttpClient) { }


  public list20MostCommentsPoems(): Observable<DataResult> {
    return this.http.get<DataResult>(`${this.host}/poem/list/populer/most-comment`);
  }
  public list20MostLikedPoems(): Observable<DataResult> {
    return this.http.get<DataResult>(`${this.host}/poem/list/populer/most-liked`);
  }
  public getPoemWithPoemBox(poemId: number): Observable<DataResult> {
    return this.http.get<DataResult>(`${this.host}/poem/list/with-poembox/${poemId}`);
  }
  public searchPoems(search: string): Observable<DataResult> {
    return this.http.get<DataResult>(`${this.host}/poem/list/search/${search}`);
  }
  public getRandomPoem(): Observable<DataResult> {
    return this.http.get<DataResult>(`${this.host}/poem/list/random`);
  }
  public getProfilePoemsByUsername(formData: FormData): Observable<DataResult> {
    return this.http.post<DataResult>(`${this.host}/poem/list/profile/username`, formData);
  }
  public getSelectedCategoriesPoems(formData: FormData): Observable<DataResult> {
    return this.http.post<DataResult>(`${this.host}/poem/list/categories`, formData);
  }
  public getFollowingsPoems(formData: FormData): Observable<DataResult> {
    return this.http.post<DataResult>(`${this.host}/poem/list/followings/`, formData);
  }
  public getUsersPoemByCategoryTitle(categoryTitle: string): Observable<DataResult> {
    return this.http.get<DataResult>(`${this.host}/poem/category-title/${categoryTitle}`);
  }
  public addPoem(formData: FormData): Observable<Result> {
    return this.http.post<Result>(`${this.host}/poem/create`, formData);
  }
  public updatePoem(formData: FormData): Observable<Result> {
    return this.http.post<Result>(`${this.host}/poem/update`, formData);
  }
  public deletePoem(poemId: number): Observable<Result> {
    return this.http.delete<Result>(`${this.host}/poem/delete/${poemId}`);
  }


  public createPoemData(poemContent: string, poemTitle: string, categoryTitle: string): FormData {
    const formData = new FormData();
    formData.append('poemContent', poemContent);
    formData.append('poemTitle', poemTitle);
    formData.append('categoryTitle', categoryTitle);
    return formData;
  }

  public requestPoemData(profileUsername: string, indexStart: number, indexEnd: number): FormData {
    const formData = new FormData();
    formData.append('username', profileUsername);
    formData.append('indexStart', JSON.stringify(indexStart));
    formData.append('indexEnd', JSON.stringify(indexEnd));
    return formData;
  }

  public requestFollowingsPoemData(indexStart: number, indexEnd: number): FormData {
    const formData = new FormData();
    formData.append('indexStart', JSON.stringify(indexStart));
    formData.append('indexEnd', JSON.stringify(indexEnd));
    return formData;
  }


  public updatePoemData(poemId: number, poemTitle: string, poemContent: string, categoryTitle: string): FormData {
    const formData = new FormData();
    formData.append('poemId', JSON.stringify(poemId));
    formData.append('poemTitle', poemTitle);
    formData.append('poemContent', poemContent);
    formData.append('categoryTitle', categoryTitle);
    return formData;
  }











}