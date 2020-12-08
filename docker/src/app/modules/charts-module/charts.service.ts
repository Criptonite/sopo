import {Injectable} from '@angular/core';
import {ChartsComponent} from './charts.component';
import {ChartsApiService} from './charts-api.service';

@Injectable()
export class ChartsService {

  constructor() {
  }

  getDeathTsByRegionsData(report: any) {
    const statData: {[tsCount: number]: number} = {};
    const countData: {[tsCount: number]: number} = {};
    Object.keys(report).forEach(year => {
      const reportRegions = report[year].deathTsByRegions;
      Object.keys(reportRegions).forEach(region => {
        reportRegions[region].forEach(value => {
          if (statData[value.tsCount] === undefined) { statData[value.tsCount] = 0; }
          statData[value.tsCount] += +value.deathCount;
          if (countData[value.tsCount] === undefined) { countData[value.tsCount] = 0; }
          countData[value.tsCount] += 1;
        });
      });
    });
    Object.keys(statData).forEach(tsCount => {
      statData[tsCount] = statData[tsCount] / countData[tsCount];
    });
    return {
      labels: Object.keys(statData),
      datasets: [{
        data: Object.values(statData),
        fill: false,
        borderColor: '#1E88E5',
        label: 'Deaths by TS count'
      }],
      options: {

      }
    };
  }

  getDeathByRegionsData(report: any) {
    const regions: {[region: string]: number; } = {};
    Object.keys(report).forEach(year => {
      const reportRegions = report[year].deathByRegions;
      Object.keys(reportRegions).forEach(region => {
        if (regions[region] === undefined) {regions[region] = 0; }
        regions[region] += reportRegions[region];
      });
    });
    return {
      labels: Object.keys(regions),
      datasets: [{
        data: Object.values(regions),
        backgroundColor: '#42A5F5',
        borderColor: '#1E88E5',
        label: 'Deaths by region'
      }]
    };
  }

  getGuiltyByRegionsData(report: any) {
    let men = 0;
    let women = 0;
    Object.keys(report).forEach(year => {
      const reportRegions = report[year].guiltyByRegions;
      Object.keys(reportRegions).forEach(region => {
        men += +reportRegions[region].guiltyMen;
        women += +reportRegions[region].guiltyWomen;
      });
    });
    return {
      labels: ['Men', 'Women'],
      datasets: [{
        data: [men, women],
        backgroundColor: [
          '#36A2EB',
          '#FF6384'
        ],
        hoverBackgroundColor: [
          '#36A2EB',
          '#FF6384'
        ]
      }]
    };
  }

  getOptionsForDeathsByTS() {
    return {
      scales: {
        yAxes: [{
          display: true,
          scaleLabel: {
            display: true,
            labelString: 'Deaths in accident'
          },
          ticks: {
            beginAtZero: true,
          }
        }],
        xAxes: [{
          display: true,
          scaleLabel: {
            display: true,
            labelString: 'TS count in accident'
          },
          ticks: {
            beginAtZero: true,
          }
        }]
      },
    };
  }

  getOptionsForDeathsByRegion() {
    return {
      scales: {
        yAxes: [{
          display: true,
          scaleLabel: {
            display: true,
            labelString: 'Total deaths in region'
          }
        }],
        xAxes: [{
          display: true,
          scaleLabel: {
            display: true,
            labelString: 'Region'
          }
        }]
      },
    };
  }
}
