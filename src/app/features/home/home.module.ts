import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { MapComponent } from './components/map/map.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { RouterModule } from '@angular/router';


@NgModule({
  declarations: [
    MapComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    // RouterModule,
    HomeRoutingModule,
  ]
})
export class HomeModule { }
