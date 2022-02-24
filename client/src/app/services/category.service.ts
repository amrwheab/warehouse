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

  getCategories(page: string, search: string): Observable<{categories: Category[], count: number}> {
    return this.http.get<{categories: Category[], count: number}>(environment.apiUrl + '/categories', { params: { page, search } });
  }

  getOneCategory(id: string): Observable<Category> {
    return this.http.get<Category>(environment.apiUrl + '/categories/onecategory/' + id);
  }

  addCategory(value: Category): Observable<any> {
    return this.http.post(environment.apiUrl + '/categories', value );
  }

  updateCategory(value: Category, id: string): Observable<any> {
    return this.http.put(environment.apiUrl + '/categories/' + id, value);
  }

  deleteCategory(id: string): Observable<any> {
    return this.http.delete(environment.apiUrl + '/categories/' + id);
  }

}
