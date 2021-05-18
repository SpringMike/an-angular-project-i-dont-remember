import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {NotificationUser} from '../../model/notificationUser';
import {Utilitie} from '../../model/utilitie';
import {User} from '../../model/user';

const API_URL = `${environment.apiUrl}`;

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private http: HttpClient) {
  }

  getAllNotification(): Observable<NotificationUser[]> {
    return this.http.get<NotificationUser[]>(API_URL + '/notifications');
  }

  getAllNotificationByUser(user: any): Observable<NotificationUser[]> {
    return this.http.post<NotificationUser[]>(API_URL + '/notifications/byUser', user);
  }

  createNotification(notification: NotificationUser): Observable<NotificationUser> {
    return this.http.post<NotificationUser>(API_URL + '/notifications', notification);
  }

  updateNotification(notification: NotificationUser): Observable<NotificationUser> {
    return this.http.put<NotificationUser>(API_URL + `/notifications`, notification);
  }

  deleteNotification(id: number): Observable<NotificationUser> {
    return this.http.delete<NotificationUser>(API_URL + `/notifications/${id}`);
  }

  getNotification(id: number): Observable<NotificationUser> {
    return this.http.get<NotificationUser>(API_URL + `/notifications/${id}`);
  }

  deleteListNotification(id: number[]): Observable<NotificationUser> {
    return this.http.post<NotificationUser>(API_URL + '/notifications/deleteList', id);
  }
}
