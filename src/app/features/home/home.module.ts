import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { MapComponent } from './components/map/map.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatIconModule } from '@angular/material/icon';
import { VirtualTourComponent } from './components/virtual-tour/virtual-tour.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { FacultyDetailsComponent } from './components/faculty-details/faculty-details.component';
import { RecomendationsComponent } from './components/recomendations/recomendations.component';


@NgModule({
  declarations: [
    MapComponent,
    VirtualTourComponent,
    FacultyDetailsComponent,
    RecomendationsComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    MatIconModule,
    // RouterModule,
    MatProgressBarModule,
    HomeRoutingModule,
    MatProgressSpinnerModule,
  ]
})
export class HomeModule { }
