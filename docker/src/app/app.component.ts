import {Component, OnInit} from '@angular/core';
import {MenuItem} from 'primeng/api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  items: MenuItem[];

  constructor() {
  }

  ngOnInit() {
    this.items = [
      {label: 'Map', icon: 'fa fa-fw fa-map', routerLink: ['/map']},
      {label: 'Stats', icon: 'fa fa-fw fa-bar-chart', routerLink: ['/charts']},
      {label: 'Uploader', icon: 'fa fa-fw fa-download', routerLink: ['/uploader']},
    ];
  }
}
