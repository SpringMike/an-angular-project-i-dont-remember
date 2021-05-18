import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';
import {Service} from '../../model/service';

const API_URL = `${environment.apiUrl}`;

@Injectable({
  providedIn: 'root'
})
export class ServiceService {

  constructor(private http: HttpClient) {
  }

  getAllService(): Observable<Service[]> {
    return this.http.get<Service[]>(API_URL + '/services');
  }

  getAllServiceStatusTrue(): Observable<Service[]> {
    return this.http.get<Service[]>(API_URL + '/services/statusTrue');
  }

  createService(service: Service): Observable<Service> {
    return this.http.post<Service>(API_URL + '/services', service);
  }

  getService(id: number): Observable<Service> {
    return this.http.get<Service>(API_URL + `/services/${id}`);
  }

  updateService(id: number, service: Service): Observable<Service> {
    return this.http.put<Service>(API_URL + `/services/${id}`, service);
  }

  deleteService(id: number): Observable<Service> {
    return this.http.delete<Service>(API_URL + `/services/${id}`);
  }

  deleteListService(id: number[]): Observable<Service> {
    return this.http.post<Service>(API_URL + '/services/deleteList', id);
  }
}
