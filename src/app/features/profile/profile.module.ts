import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProfileRoutingModule } from './profile-routing.module';
import { ProfileLayoutComponent } from './components/profile-layout/profile-layout.component';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { PersonalInformationComponent } from './components/personal-information/personal-information.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    ProfileLayoutComponent,
    PersonalInformationComponent
  ],
  imports: [
    CommonModule,
    MatIconModule,
    MatTabsModule,
    ProfileRoutingModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class ProfileModule { }
