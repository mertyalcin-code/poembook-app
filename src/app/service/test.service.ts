import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TestService {
  private host = environment.apiUrl;
  constructor(private http: HttpClient) { }

  public test(): Observable<Date> {
    return this.http.get<Date>(`${this.host}/test/test`);
  }
}
