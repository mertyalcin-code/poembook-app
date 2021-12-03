import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { DataResult } from '../model/result/data-result';
import { Result } from '../model/result/result';

@Injectable({
  providedIn: 'root'
})
export class LogService {

  private host = environment.apiUrl;
  constructor(private http: HttpClient) { }
  public allLogs(): Observable<DataResult> {
    return this.http.get<DataResult>(`${this.host}/log/logs`);
  }
  public getLogWithLogType(type: string): Observable<DataResult> {
    return this.http.get<DataResult>(`${this.host}/log/logs/${type}`);
  }
  public getLogTypes(): Observable<DataResult> {
    return this.http.get<DataResult>(`${this.host}/log/types`);
  }
  public deleteAllLogs(): Observable<Result> {
    return this.http.get<Result>(`${this.host}/log/delete-all`);
  }
  public deleteByType(type: string): Observable<Result> {
    return this.http.get<Result>(`${this.host}/log/delete-type/${type}`);
  }
  public deleteAllLogsExceptThisWeek(): Observable<Result> {
    return this.http.get<Result>(`${this.host}/log/delete-except-this-week`);
  }
}
