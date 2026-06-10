import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';
import {User} from '../dataaccess/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private http = inject(HttpClient);

  public static readonly backendUrl = 'user';

  public getList(): Observable<User[]> {
    return this.http.get<User[]>(environment.backendBaseUrl + UserService.backendUrl);
  }

  public getOne(id: number): Observable<User> {
    return this.http.get<User>(environment.backendBaseUrl + UserService.backendUrl + `/${id}`);
  }

  public update(user: User): Observable<User> {
    return this.http.put<User>(environment.backendBaseUrl + UserService.backendUrl + `/${user.id}`, user);
  }

  public save(user: User): Observable<User> {
    return this.http.post<User>(environment.backendBaseUrl + UserService.backendUrl, user);
  }

  public delete(id: number): Observable<HttpResponse<string>> {
    return this.http.delete<string>(environment.backendBaseUrl + UserService.backendUrl + `/${id}`, {observe: 'response'});
  }
}
