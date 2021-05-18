import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {User} from '../../model/user';
import {Observable} from 'rxjs';
import {Notification} from '../../model/notification';
import {Utilitie} from '../../model/utilitie';
import {Category} from '../../model/category';

const API_URL = `${environment.apiUrl}`;

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) {
  }

  register(user: User): Observable<User> {
    return this.http.post<User>(API_URL + '/register', user);
  }

  getAllUser(): Observable<User[]> {
    return this.http.get<User[]>(API_URL + '/accounts');
  }

  getUser(id: number): Observable<User> {
    return this.http.post<User>(API_URL + `/accounts`, id);
  }

  updateUser(user: User): Observable<User> {
    return this.http.put<User>(API_URL + `/accounts`, user);
  }

  deleteUser(id: number): Observable<User> {
    return this.http.delete<User>(API_URL + `/accounts/${id}`);
  }
}
