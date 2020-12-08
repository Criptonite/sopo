import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ChartsComponent} from './charts.component';
import {ChartsService} from './charts.service';
import {ChartsApiService} from './charts-api.service';
import {ChartModule} from 'primeng/chart';
import {CommonModule} from '@angular/common';
import {ButtonModule, DropdownModule, ListboxModule, ProgressSpinnerModule} from 'primeng/primeng';
import {FormsModule} from '@angular/forms';

const routes: Routes = [{path: '', component: ChartsComponent}];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    ChartModule,
    CommonModule,
    DropdownModule,
    FormsModule,
    ListboxModule,
    ProgressSpinnerModule,
    ButtonModule
  ],
  declarations: [
    ChartsComponent
  ],
  providers: [
    ChartsService,
    ChartsApiService
  ],
  exports: [],
})
export class ChartsModule {
}
