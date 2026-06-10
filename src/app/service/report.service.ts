import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';
import {Report, ReportType} from '../dataaccess/report';

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  private http = inject(HttpClient);

  public static readonly backendUrl = 'report';

  public getList(): Observable<Report[]> {
    return this.http.get<Report[]>(environment.backendBaseUrl + ReportService.backendUrl);
  }

  public getOne(id: number): Observable<Report> {
    return this.http.get<Report>(environment.backendBaseUrl + ReportService.backendUrl + `/${id}`);
  }

  public getByType(type: ReportType): Observable<Report[]> {
    return this.http.get<Report[]>(environment.backendBaseUrl + ReportService.backendUrl + `/type/${type}`);
  }

  public update(report: Report): Observable<Report> {
    return this.http.put<Report>(environment.backendBaseUrl + ReportService.backendUrl + `/${report.id}`, report);
  }

  public save(report: Report): Observable<Report> {
    return this.http.post<Report>(environment.backendBaseUrl + ReportService.backendUrl, report);
  }

  public delete(id: number): Observable<HttpResponse<string>> {
    return this.http.delete<string>(environment.backendBaseUrl + ReportService.backendUrl + `/${id}`, {observe: 'response'});
  }
}
