import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Category } from '../interfaces/Category';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(private http: HttpClient) { }

  getCategories(page: string, search: string): Observable<Category[]> {
    return this.http.get<Category[]>(environment.apiUrl + '/categories', { params: { page, search } });
  }

}
