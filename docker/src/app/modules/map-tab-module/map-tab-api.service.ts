import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Region} from '../../models/region';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  })
};

@Injectable()
export class MapTabApiService {

  constructor(private httpClient: HttpClient) {
  }
  private regionListUrl = '/regions';
  private accidentsUrl = '/accidents';
  private typesUrl = '/types';
  private regionYearTypeFilerUrl = '/withRegionAndType';
  private regionYearUrl = '/withRegion';

  getAllRegions(): Observable<any> {
    return this.httpClient.get(this.regionListUrl);
  }

  getAllTypes(): Observable<any> {
    return this.httpClient.get(this.typesUrl);
  }

  getAccidents(selectedRegion: string, year, accidentType?: string): Observable<any> {
    let additionalUrl: string;
    let queryParams = new HttpParams()
      .set('region', selectedRegion)
      .set('year', year);
    if (accidentType !== null) {
      additionalUrl = this.regionYearTypeFilerUrl;
      queryParams = queryParams.append('type', accidentType.toString());
    } else {
      additionalUrl = this.regionYearUrl;
    }
    return this.httpClient.get(this.accidentsUrl + additionalUrl, {params: queryParams});
  }
}
