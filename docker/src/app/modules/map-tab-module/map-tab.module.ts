import { NgModule } from '@angular/core';
import {DropdownModule} from 'primeng/dropdown';
import {SpinnerModule} from 'primeng/spinner';
import {ButtonModule} from 'primeng/button';
import {MapModule} from '../map-module/map.module';
import {MapTabApiService} from './map-tab-api.service';
import {MapTabComponent} from './map-tab.component';
import {MapTabService} from './map-tab.service';
import {FormsModule} from '@angular/forms';
import {RouterModule, Routes} from '@angular/router';

const routes: Routes = [{path: '', component: MapTabComponent}];

@NgModule({
  declarations: [
    MapTabComponent
  ],
  imports: [
    RouterModule.forChild(routes),
    MapModule,
    DropdownModule,
    SpinnerModule,
    FormsModule,
    ButtonModule
  ],
  providers: [
    MapTabService,
    MapTabApiService
  ],
  bootstrap: [MapTabComponent],
  exports: [MapTabComponent]
})
export class MapTabModule { }
