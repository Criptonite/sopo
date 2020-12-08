import {Component, OnInit} from '@angular/core';
import {ChartsApiService} from './charts-api.service';
import {Region} from '../../models/region';
import {ChartsService} from './charts.service';

@Component({
  selector: 'app-charts',
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.css'],
})
export class ChartsComponent  implements OnInit {

  chartType: any;
  chartTypes: any;
  pieData: any;
  barChartData: any;
  lineChartData: any;
  regions: Region [];
  years: any[];
  selectedRegions: Region [];
  selectedYears: any [];
  reportLoading = false;

  constructor (private chartApiService: ChartsApiService, private chartService: ChartsService) {
  }

  ngOnInit(): void {
    this.getRegions();
    this.years = [
      {name: '2016', value: 2016},
      {name: '2017', value: 2017},
      {name: '2018', value: 2018},
    ];
    this.chartTypes = [
      {label: 'Deaths by TS count', value: 0},
      {label: 'Deaths by regions', value: 1},
      {label: 'Men/Women in accidents', value: 2},
    ];
  }

  chartOptions(title: string) {
    let additionalOptions;
    if (this.chartType === 0) {
      additionalOptions = this.chartService.getOptionsForDeathsByTS();
    }
    if (this.chartType === 1) {
      additionalOptions = this.chartService.getOptionsForDeathsByRegion();
    }
    return {
      scales: additionalOptions ? additionalOptions.scales : null,
      title: {
        display: true,
        text: title,
        fontSize: 16
      },
      legend: {
        position: 'bottom'
      }
    };
  }

  getRegions(): void {
    this.chartApiService.getAllRegions().subscribe(regions => {
      this.regions = regions;
    });
  }

  getReport(): void {
    this.reportLoading = true;
    this.clearReportData();
    const years = this.selectedYears.map(year => year.value);
    this.chartApiService.getReport(this.chartType, years, this.selectedRegions).subscribe(report => {
      switch (this.chartType) {
        case 0:
          this.lineChartData = this.chartService.getDeathTsByRegionsData(report);
          break;
        case 1:
          this.barChartData = this.chartService.getDeathByRegionsData(report);
          break;
        case 2:
          this.pieData = this.chartService.getGuiltyByRegionsData(report);
          break;
      }
      this.reportLoading = false;
    });
  }

  isReportDataLoaded(): boolean {
    return this.pieData || this.barChartData || this.lineChartData;
  }

  clearReportData() {
    this.barChartData = null;
    this.lineChartData = null;
    this.pieData = null;
  }
}
