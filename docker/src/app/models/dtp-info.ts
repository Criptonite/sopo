import {TsInfo} from './ts-info';
import {UchInfo} from './uch-info';

export class DtpInfo {
  sdor: string[];
  ndu: string[];
  light: string;
  weather: string;
  longitude: number;
  latitude: number;
  ts_info: TsInfo[];
  uch_info: UchInfo[];
}
