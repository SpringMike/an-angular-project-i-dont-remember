import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';
import {Utilitie} from '../../model/utilitie';
import {Category} from '../../model/category';

const API_URL = `${environment.apiUrl}`;

@Injectable({
  providedIn: 'root'
})
export class UtilitieService {
  constructor(private http: HttpClient) {
  }

  getAllUtilitie(): Observable<Utilitie[]> {
    return this.http.get<Utilitie[]>(API_URL + '/utilities');
  }

  getAllUtilitieStatusTrue(): Observable<Utilitie[]> {
    return this.http.get<Utilitie[]>(API_URL + '/utilities/statusTrue');
  }

  createUtilitie(utilitie: Utilitie): Observable<Utilitie> {
    return this.http.post<Utilitie>(API_URL + '/utilities', utilitie);
  }

  getUtilitie(id: number): Observable<Utilitie> {
    return this.http.get<Utilitie>(API_URL + `/utilities/${id}`);
  }

  updateUtilitie(id: number, utilitie: Utilitie): Observable<Utilitie> {
    return this.http.put<Utilitie>(API_URL + `/utilities/${id}`, utilitie);
  }

  deleteUtilitie(id: number): Observable<Utilitie> {
    return this.http.delete<Utilitie>(API_URL + `/utilities/${id}`);
  }

  deleteListUtilitie(id: number[]): Observable<Utilitie> {
    return this.http.post<Utilitie>(API_URL + '/utilities/deleteList', id);
  }
}
