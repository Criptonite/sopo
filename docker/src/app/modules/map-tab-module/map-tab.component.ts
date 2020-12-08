import {Component, OnInit} from '@angular/core';
import {Type} from '../../models/accident-type';
import {MapTabApiService} from './map-tab-api.service';
import {MapService} from '../map-module/map.service';
import {Region} from '../../models/region';

@Component({
  selector: 'app-map-tab',
  templateUrl: './map-tab.component.html',
  styleUrls: ['./map-tab.component.css']
})
export class MapTabComponent implements OnInit {

  types: Type[];
  regions: Region [];
  selectedType: Type;
  selectedRegion: Region;
  year: number;

  constructor(private apiService: MapTabApiService, private mapService: MapService) {
  }

  ngOnInit() {
    this.selectedRegion = null;
    this.year = this.year || 2018;
    this.getRegions();
    this.getType();
  }

  getRegions(): void {
    this.apiService.getAllRegions().subscribe(regions => {
      this.regions = regions;
      if (this.regions && this.regions.length) {
        this.selectedRegion = this.selectedRegion || this.regions[0];
      }
    });
  }

  getType(): void {
    this.apiService.getAllTypes().subscribe(types => this.types = types);
  }

  getAccidents(): void {
    this.apiService.getAccidents(this.selectedRegion.name, this.year, this.selectedType ? this.selectedType.typeName : null)
      .subscribe(accidents => {
        this.mapService.setAccident(accidents);
      });
  }
}
