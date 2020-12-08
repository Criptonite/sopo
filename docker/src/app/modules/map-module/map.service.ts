import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {Accident} from '../../models/accident';

@Injectable({
  providedIn: 'root'
})
export class MapService {

  constructor() {
  }

  private accidents: Accident[];
  private _data = new BehaviorSubject(this.accidents);

  setAccident(accidentData: Accident[]) {
    if (accidentData) {
      this._data.next(accidentData);
    }
  }

  subscribe = async (func) => {
    return this._data.subscribe(func);
  };

  getDataCoords(data: Accident[]) {
    const coorsArray = [];
    data.forEach(accident => {
      const lat = accident.dtp_info.latitude;
      const lng = accident.dtp_info.longitude;
      coorsArray.push({lat: lat, lng: lng});
    });
    return coorsArray;
  }
}
