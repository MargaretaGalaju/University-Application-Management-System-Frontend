import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './layouts/header/header.component';
import { BasicLayoutComponent } from './layouts/basic-layout/basic-layout.component';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { RecommendationsDialogComponent } from './components/recommendations-dialog/recommendations-dialog.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ChipsAutocompleteComponent } from './components/chips-autocomplete/chips-autocomplete.component';
import { ApplicationStepperComponent } from './components/application-stepper/application-stepper.component';
import { MatStepperModule } from '@angular/material/stepper';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSnackBarModule, MAT_SNACK_BAR_DEFAULT_OPTIONS } from '@angular/material/snack-bar';

@NgModule({
  declarations: [
    HeaderComponent,
    BasicLayoutComponent,
    RecommendationsDialogComponent,
    ChipsAutocompleteComponent,
    ApplicationStepperComponent,
  ],
  imports: [
    CommonModule,
    MatIconModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatAutocompleteModule,
    MatChipsModule,
    MatCheckboxModule,
    MatStepperModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
  ],
  exports: [
    HeaderComponent,
    BasicLayoutComponent,
    MatFormFieldModule,
    MatAutocompleteModule,
    MatChipsModule,
    MatInputModule,
    MatProgressSpinnerModule,
    ChipsAutocompleteComponent,
  ],
  providers: [
    {provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: {duration: 2500}}
  ]
})
export class SharedModule { }
