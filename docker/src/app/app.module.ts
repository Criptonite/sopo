import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MapTabApiService} from './modules/map-tab-module/map-tab-api.service';
import {HttpClientModule} from '@angular/common/http';
import {HttpModule} from '@angular/http';
import {TabMenuModule} from 'primeng/tabmenu';
import {RoutingModule} from './routing.module';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpModule,
    HttpClientModule,
    TabMenuModule,
    RoutingModule
  ],
  providers: [
    MapTabApiService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
