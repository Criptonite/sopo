import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';


const routes: Routes = [
  {
    path: 'map',
    loadChildren: './modules/map-tab-module/map-tab.module#MapTabModule',
  },
  {
    path: 'charts',
    loadChildren: './modules/charts-module/charts.module#ChartsModule',
  },
  {
    path: 'uploader',
    loadChildren: './modules/uploader-module/uploader.module#UploaderModule',
  },
  // {
  //   path: '',
  //   redirectTo: '/map',
  //   pathMatch: 'full'
  // }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes),
  ],
  exports: [
    RouterModule,
  ]
})
export class RoutingModule {
}
