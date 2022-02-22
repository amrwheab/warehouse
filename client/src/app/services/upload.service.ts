import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UploadService {

  constructor(private http: HttpClient) { }

  removeFile(name: string): Observable<string> {
    return this.http.delete<string>(environment.apiUrl + '/uploadimage', {params: {name}});
  }

  updateFile(formdata: FormData): Observable<string> {
    return this.http.post<string>(environment.apiUrl + '/uploadimage/update', formdata);
  }
}
