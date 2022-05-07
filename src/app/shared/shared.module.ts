import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './layouts/header/header.component';
import { BasicLayoutComponent } from './layouts/basic-layout/basic-layout.component';
import { RouterModule } from '@angular/router';
import {MatIconModule} from '@angular/material/icon';
import { RecommendationsDialogComponent } from './components/recommendations-dialog/recommendations-dialog.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {MatChipsModule} from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';



@NgModule({
  declarations: [
    HeaderComponent,
    BasicLayoutComponent,
    RecommendationsDialogComponent,
  ],
  imports: [
    CommonModule,
    MatIconModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    MatChipsModule,
    MatFormFieldModule,
    MatAutocompleteModule,
    MatChipsModule,
    MatProgressSpinnerModule,
  ],
  exports: [
    HeaderComponent,
    BasicLayoutComponent,
  ]
})
export class SharedModule { }
