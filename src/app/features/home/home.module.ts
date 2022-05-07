import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { MapComponent } from './components/map/map.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { VirtualTourComponent } from './components/virtual-tour/virtual-tour.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FacultyDetailsComponent } from './components/faculty-details/faculty-details.component';


@NgModule({
  declarations: [
    MapComponent,
    VirtualTourComponent,
    FacultyDetailsComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    MatIconModule,
    // RouterModule,
    HomeRoutingModule,
    MatProgressSpinnerModule,
  ]
})
export class HomeModule { }
