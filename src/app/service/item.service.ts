import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';
import {Item} from '../dataaccess/item';

@Injectable({
  providedIn: 'root'
})
export class ItemService {
  private http = inject(HttpClient);

  public static readonly backendUrl = 'item';

  public getList(): Observable<Item[]> {
    return this.http.get<Item[]>(environment.backendBaseUrl + ItemService.backendUrl);
  }

  public getOne(id: number): Observable<Item> {
    return this.http.get<Item>(environment.backendBaseUrl + ItemService.backendUrl + `/${id}`);
  }

  public update(item: Item): Observable<Item> {
    return this.http.put<Item>(environment.backendBaseUrl + ItemService.backendUrl + `/${item.id}`, item);
  }

  public save(item: Item): Observable<Item> {
    return this.http.post<Item>(environment.backendBaseUrl + ItemService.backendUrl, item);
  }

  public delete(id: number): Observable<HttpResponse<string>> {
    return this.http.delete<string>(environment.backendBaseUrl + ItemService.backendUrl + `/${id}`, {observe: 'response'});
  }
}
