import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MessageService} from 'primeng/api';
import {MapService} from '../map.service';
import {Accident} from '../../../models/accident';

declare var google: any;

@Component({
  selector: 'app-map-component',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {

  options: any;
  overlays: any[];
  dialogVisible: boolean;
  markerTitle: string;
  infoWindow: any;
  private mapServiceSubscription: any;

  private accidents: Accident[];
  private heatMapLayer: any;
  selectedAccident: Accident;
  shortInfoDialog: boolean;
  longInfoDialog: boolean;
  heatMapLayerEnabled = false;
  markerLayerEnabled = true;

  constructor(private messageService: MessageService, private mapService: MapService) {
  }

  @ViewChild('gmap')
  gMapComponent: any;

  ngOnInit() {
    this.options = {
      center: {lat: 36.890257, lng: 30.707417},
      zoom: 6
    };

    this.infoWindow = new google.maps.InfoWindow();
    this.mapServiceSubscription = this.mapService.subscribe(data => {
      if (data) {
        this.clear();
        this.accidents = data;
        if (data.length > 0) {
          data.forEach(accident => this.handleAccident(accident));
          if (this.gMapComponent.getMap()) {
            const lastAccident = this.accidents[this.accidents.length - 1];
            this.setCenter(this.getLatFromAccident(lastAccident), this.getLngFromAccident(lastAccident));
            this.initHeapLayer(this.accidents);
          }
        } else {
          this.messageService.add({severity: 'info', summary: 'Нет происшествий для выбраных параметров'});
          this.disableHeatMapLayer();
        }
      }
    });
  }

  initHeapLayer(data: Accident[]) {
    const points = this.mapService.getDataCoords(data);
    const gPoints = [];
    points.forEach(point => gPoints.push(new google.maps.LatLng(point.lat, point.lng)));
    this.heatMapLayer = new google.maps.visualization.HeatmapLayer({
      data: gPoints
    });
    this.heatMapLayer.set('radius', this.heatMapLayer.get('radius') ? null : 20);
    if (this.heatMapLayerEnabled) {
      this.heatMapLayer.setMap(this.gMapComponent.getMap());
    }
  }

  enableHeatMapLayer() {
    if (this.heatMapLayer) {
      this.heatMapLayer.setMap(this.gMapComponent.getMap());
    }
  }

  disableHeatMapLayer() {
    if (this.heatMapLayer) {
      this.heatMapLayer.setMap(null);
    }
  }

  enableMarkerLayer() {
    if (this.overlays) {
      this.setMapForMarkers(this.gMapComponent.getMap());
    }
  }

  disableMarkerLayer() {
    if (this.overlays) {
      this.setMapForMarkers(null);
    }
  }

  setMapForMarkers(map) {
    this.overlays.forEach(marker => {
      marker.setMap(map);
    });
  }

  handleAccident(accident: Accident) {
    this.addMarker(this.getLatFromAccident(accident), this.getLngFromAccident(accident), accident.KartId);
  }

  openDetailedReport() {
    this.longInfoDialog = true;
  }

  getLatFromAccident(acc: Accident) {
    return acc.dtp_info.latitude;
  }

  getLngFromAccident(acc: Accident) {
    return acc.dtp_info.longitude;
  }

  handleOverlayClick(event) {
    const title = event.overlay.getTitle();
    this.selectAccidentById(event.overlay.getTitle());
    event.map.setCenter(event.overlay.getPosition());
    this.shortInfoDialog = true;
  }

  selectAccidentById(id: string): void {
    this.selectedAccident = this.accidents.find(accident => accident.KartId === id);
  }

  setCenter(lat, lng) {
    this.gMapComponent.getMap().setCenter(new google.maps.LatLng(lat, lng));
  }

  addMarker(lat, lng, title?) {
    this.overlays.push(
      new google.maps.Marker({
        position: {
          lat: lat,
          lng: lng
        },
        title: title,
        draggable: false
      }));
    this.markerTitle = null;
    this.dialogVisible = false;
  }

  clear() {
    this.overlays = [];
  }

  heatMapLayerChange(e: any) {
    if (e.checked) {
      this.enableHeatMapLayer();
    } else {
      this.disableHeatMapLayer();
    }
  }

  markerLayerChange(e: any) {
    if (e.checked) {
      this.enableMarkerLayer();
    } else {
      this.disableMarkerLayer();
    }
  }

  onMapReadyEvent($event: any) {
    if (this.accidents && this.accidents.length) {
      const lastAccident = this.accidents[this.accidents.length - 1];
      this.setCenter(this.getLatFromAccident(lastAccident), this.getLngFromAccident(lastAccident));
      this.initHeapLayer(this.accidents);
    }
  }
}
