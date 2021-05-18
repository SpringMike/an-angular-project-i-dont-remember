import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import {House} from '../../model/house';
import {environment} from '../../../environments/environment';
import {Category} from '../../model/category';
import {Product} from '../../model/product';
import {User} from '../../model/user';

const API_URL = `${environment.apiUrl}`;

@Injectable({
  providedIn: 'root'
})
export class HouseService {
  constructor(private http: HttpClient) {
  }

  private messageSource = new BehaviorSubject('');
  currentMessage = this.messageSource.asObservable();

  changeMessage(message: string) {
    this.messageSource.next(message);
  }

  getAllHouse(): Observable<House[]> {
    return this.http.get<House[]>(API_URL + '/houses');
  }

  findByStatusTrueOrderByDiscountDesc(): Observable<House[]> {
    return this.http.get<House[]>(API_URL + '/houses/discount');
  }

  findByOrderByNumberHiresDesc(): Observable<House[]> {
    return this.http.get<House[]>(API_URL + '/houses/numberHires');
  }

  getAllHouseStatusTrue(): Observable<House[]> {
    return this.http.get<House[]>(API_URL + '/houses/statusTrue');
  }

  createHouse(house: House): Observable<House> {
    return this.http.post<House>(API_URL + '/houses', house);
  }

  getHouse(id: number): Observable<House> {
    return this.http.get<House>(API_URL + `/houses/${id}`);
  }

  updateHouse(id: number, house: House): Observable<House> {
    return this.http.put<House>(API_URL + `/houses/${id}`, house);
  }

  deleteHouse(id: number): Observable<House> {
    return this.http.delete<House>(API_URL + `/houses/${id}`);
  }

  getAllHouseByUser(user: User): Observable<House[]> {
    return this.http.post<House[]>(API_URL + '/houses/listHouse', user);
  }

  getAllHousetByName(address: string): Observable<House[]> {
    return this.http.get<House[]>(API_URL + '/houses/search?address=' + address);
  }

  public searchAdvanced(address: string, numberRoom: string, upperBound: string, lowerBound: string): Observable<any> {
    // tslint:disable-next-line:max-line-length
    return this.http.get('http://localhost:5000/houses/searchAdvanced?address=' + address + '&numberRoom=' + numberRoom + '&upperBound=' + upperBound + '&lowerBound=' + lowerBound);
  }


  deleteListHouse(id: number[]): Observable<House> {
    return this.http.post<House>(API_URL + '/houses/deleteList', id);
  }
}
