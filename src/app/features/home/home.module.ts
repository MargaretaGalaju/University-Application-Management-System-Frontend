import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { MapComponent } from './components/map/map.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';


@NgModule({
  declarations: [
    MapComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    MatIconModule,
    // RouterModule,
    HomeRoutingModule,
  ]
})
export class HomeModule { }
