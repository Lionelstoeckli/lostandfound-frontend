import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';
import {Claim, ClaimStatus} from '../dataaccess/claim';

@Injectable({
  providedIn: 'root'
})
export class ClaimService {
  private http = inject(HttpClient);

  public static readonly backendUrl = 'claim';

  public getList(): Observable<Claim[]> {
    return this.http.get<Claim[]>(environment.backendBaseUrl + ClaimService.backendUrl);
  }

  public getOne(id: number): Observable<Claim> {
    return this.http.get<Claim>(environment.backendBaseUrl + ClaimService.backendUrl + `/${id}`);
  }

  public getByStatus(status: ClaimStatus): Observable<Claim[]> {
    return this.http.get<Claim[]>(environment.backendBaseUrl + ClaimService.backendUrl + `/status/${status}`);
  }

  public update(claim: Claim): Observable<Claim> {
    return this.http.put<Claim>(environment.backendBaseUrl + ClaimService.backendUrl + `/${claim.id}`, claim);
  }

  public save(claim: Claim): Observable<Claim> {
    return this.http.post<Claim>(environment.backendBaseUrl + ClaimService.backendUrl, claim);
  }

  public delete(id: number): Observable<HttpResponse<string>> {
    return this.http.delete<string>(environment.backendBaseUrl + ClaimService.backendUrl + `/${id}`, {observe: 'response'});
  }
}
