import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Category} from '../../model/category';
import {House} from '../../model/house';


const API_URL = `${environment.apiUrl}`;

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(private http: HttpClient) {
  }

  getAllCategory(): Observable<Category[]> {
    return this.http.get<Category[]>(API_URL + '/categories');
  }

  getAllCategoryStatusTrue(): Observable<Category[]> {
    return this.http.get<Category[]>(API_URL + '/categories/statusTrue');
  }

  createCategory(category: Category): Observable<Category> {
    return this.http.post<Category>(API_URL + '/categories', category);
  }

  getCategory(id: number): Observable<Category> {
    return this.http.get<Category>(API_URL + `/categories/${id}`);
  }

  updateCategory(id: number, category: Category): Observable<Category> {
    return this.http.put<Category>(API_URL + `/categories/${id}`, category);
  }

  deleteCategory(id: number): Observable<Category> {
    return this.http.delete<Category>(API_URL + `/categories/${id}`);
  }

  getHouseByCategory(id: number): Observable<House[]> {
    return this.http.get<House[]>(API_URL + `/categories/${id}/houses`);
  }

  deleteListCategory(id: number[]): Observable<Category> {
    return this.http.post<Category>(API_URL + '/categories/deleteList', id);
  }
}
