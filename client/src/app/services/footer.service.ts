import { Footer } from './../interfaces/Footer';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FooterService {

  constructor(private http: HttpClient) { }

  getFooter(): Observable<Footer[]> {
    return this.http.get<Footer[]>(environment.apiUrl + '/footer');
  }

  updateFooter(id: string, value: object): Observable<any> {
    return this.http.put(environment.apiUrl + '/footer/' + id, value);
  }
}
