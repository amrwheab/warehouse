import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Carousel } from '../interfaces/Carousel';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CarouselService {

  constructor(private http: HttpClient) { }

  getCaroselItems(): Observable<Carousel[]> {
    return this.http.get<Carousel[]>(environment.apiUrl + '/carousel');
  }

  getCarouselSingleItem(id: string): Observable<Carousel> {
    return this.http.get<Carousel>(environment.apiUrl + '/carousel/single/' + id);
  }

  addCarouselItem(value: object): Observable<any> {
    return this.http.post(environment.apiUrl + '/carousel', value);
  }

  updateCarouselItem(id: string, value: object): Observable<any> {
    return this.http.put(environment.apiUrl + '/carousel/' + id, value );
  }

  deleteCarouselItem(id: string): Observable<any> {
    return this.http.delete(environment.apiUrl + '/carousel/' + id );
  }
}
