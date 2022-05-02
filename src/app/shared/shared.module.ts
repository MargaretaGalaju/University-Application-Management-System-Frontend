import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './layouts/header/header.component';
import { BasicLayoutComponent } from './layouts/basic-layout/basic-layout.component';
import { RouterModule } from '@angular/router';
import {MatIconModule} from '@angular/material/icon';



@NgModule({
  declarations: [
    HeaderComponent,
    BasicLayoutComponent,
  ],
  imports: [
    CommonModule,
    MatIconModule,
    RouterModule,
  ],
  exports: [
    HeaderComponent,
    BasicLayoutComponent,
  ]
})
export class SharedModule { }
