import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UploaderComponent } from './uploader/uploader.component';
import {FileUploadModule, ProgressSpinnerModule} from 'primeng/primeng';
import {UploaderApiService} from './uploader-api.service';
import {RouterModule, Routes} from '@angular/router';

const routes: Routes = [{path: '', component: UploaderComponent}];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    FileUploadModule,
    ProgressSpinnerModule
  ],
  declarations: [UploaderComponent],
  providers: [UploaderApiService]
})
export class UploaderModule { }
