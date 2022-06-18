import { Comment } from './../interfaces/Comment';
import { environment } from './../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  constructor(private http: HttpClient) { }

  getComments(page: number, product: string, user: string): Observable<{comments: Comment[], commentsCount: number}> {
    return this.http.get<{comments: Comment[], commentsCount: number}>
    (environment.apiUrl + `/comments?page=${page}&product=${product}&user=${user}`);
  }

  addComment(user: string, product: string, comment: string): Observable<Comment> {
    return this.http.post<Comment>(environment.apiUrl + '/comments', {user, product, comment});
  }

  upComment(id: string, user: string): Observable<string> {
    return this.http.post<string>(environment.apiUrl + '/comments/commentup/' + id, {user});
  }

  downComment(id: string, user: string): Observable<string> {
    return this.http.post<string>(environment.apiUrl + '/comments/commentdown/' + id, {user});
  }

  removeUpDown(up: boolean, id: string, user: string): Observable<string> {
    return this.http.post<string>(environment.apiUrl + '/comments/removeupdown/' + id, {up, user});
  }
}
