import {DtpInfo} from './dtp-info';

export class Accident {
  KartId: string;
  date: string;
  time: string;
  code: string;
  name: string;
  district: string;
  type: string;
  ts_count: number;
  uch_count: number;
  dtp_info: DtpInfo;
}
