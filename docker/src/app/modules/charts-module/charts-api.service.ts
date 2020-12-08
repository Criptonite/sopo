import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Region} from '../../models/region';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  })
};

@Injectable()
export class ChartsApiService {

  private regionListUrl = '/regions';
  private reportUrl = '/statistic';

  constructor(private httpClient: HttpClient) {
  }

  getAllRegions(): Observable<any> {
    return this.httpClient.get(this.regionListUrl);
  }

  getReport(chartType: string, selectedYears: number[], selectedRegions: Region[]): Observable<any> {
    return this.httpClient.post(this.reportUrl, {reportType: chartType, years: selectedYears, regions: selectedRegions}, httpOptions);
  }
}
