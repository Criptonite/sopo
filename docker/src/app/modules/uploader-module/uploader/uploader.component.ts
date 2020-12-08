import { Component, OnInit } from '@angular/core';
import {Accident} from '../../../models/accident';
import {DtpInfo} from '../../../models/dtp-info';
import {TsInfo} from '../../../models/ts-info';
import {UchInfo} from '../../../models/uch-info';
import {UploaderApiService} from '../uploader-api.service';

@Component({
  selector: 'app-uploader',
  templateUrl: './uploader.component.html',
  styleUrls: ['./uploader.component.css']
})
export class UploaderComponent implements OnInit {

  uploading = false;
  exporting = false;

  constructor(private uploaderApiService: UploaderApiService) { }

  ngOnInit() {
  }

  myUploader(event) {
    this.uploading = true;
    const files = event.files;
    files.forEach(file => {
      const fileReader = new FileReader();
      fileReader.readAsText(file);
      let str;
      fileReader.onloadend = () => {
        str = fileReader.result;
        const json = JSON.parse(str);
        const accidents = this.regionMapper(JSON.parse(json.data));
        this.uploaderApiService.addAccident(accidents).subscribe(result => {
          console.log('Sent');
          this.uploading = false;
        }, err => {
          console.log('Error', err);
          this.uploading = false;
        });
      };
    });
  }

  regionMapper(regionData): any {
    const regionName = regionData.region_name;
    const regionCode = regionData.region_code;
    const accidents = regionData.cards.map(card => {
      const accident: Accident = new Accident();
      accident.KartId = card.KartId;
      accident.code = regionCode;
      accident.name = regionName;
      accident.district = card.District;
      accident.type = card.DTP_V;
      accident.ts_count = card.K_TS;
      accident.uch_count = card.K_UCH;
      accident.time = card.Time;
      accident.date = card.date;
      accident.dtp_info = this.dtpMapper(card.infoDtp);
      return accident;
    });
    return accidents;
  }

  dtpMapper(dtpData): DtpInfo {
    const dtp = new DtpInfo();
    dtp.ndu = dtpData.ndu;
    dtp.sdor = dtpData.sdor;
    dtp.latitude = dtpData.COORD_W;
    dtp.longitude = dtpData.COORD_L;
    dtp.weather = dtpData.s_pog;
    dtp.light = dtpData.osv;
    dtp.ts_info = dtpData.ts_info.map(tsData => this.tsMapper(tsData));
    dtp.uch_info = dtpData.uchInfo.map(uchData => this.uchMapper(uchData));
    return dtp;
  }

  tsMapper(tsData): TsInfo {
    const tsInfo = new TsInfo();
    tsInfo.color = tsData.color;
    tsInfo.type = tsData.t_ts;
    tsInfo.g_v = tsData.g_v;
    tsInfo.model = tsData.m_ts;
    tsInfo.marka = tsData.marka_ts;
    tsInfo.uch_info = tsData.ts_uch.map(uchData => this.uchMapper(uchData));
    return tsInfo;
  }

  uchMapper(uchData): UchInfo {
    const uchInfo = new UchInfo();
    uchInfo.NPDD = uchData.NPDD;
    uchInfo.gender = uchData.POL;
    uchInfo.state = uchData.S_T;
    uchInfo.role = uchData.K_UCH;
    return uchInfo;
  }

  getDump() {
    this.exporting = true;
    this.uploaderApiService.getDumpLink().subscribe(resp => {
      const downloadEl = document.createElement('a');
      downloadEl.setAttribute('href', resp.link);
      downloadEl.click();
      this.exporting = false;
    }, error1 => {
      this.exporting = false;
      console.log('Download error', error1);
    });
  }
}
