import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/internal/Observable';
import { map } from 'rxjs/operators';
import { COMMA, ENTER, TAB } from 'src/app/core/constants/key-codes.constant';
import { RouteEnum } from 'src/app/core/routes/routes.enum';
import { LoadingService } from 'src/app/core/services/loading.service';
import { RecommendationApiService } from 'src/app/core/services/recommendation-api.service';

@Component({
  selector: 'app-recommendations-dialog',
  templateUrl: './recommendations-dialog.component.html',
  styleUrls: ['./recommendations-dialog.component.scss'],
})
export class RecommendationsDialogComponent implements OnInit {
  @ViewChild('hobbyInput')
  public hobbyInput: ElementRef<HTMLInputElement>;

  public formGroup: FormGroup;
  public separatorKeysCodes: number[] = [COMMA, TAB, ENTER];
  public filteredHobbies: Observable<string[]>;
  public selectedHobbies: string[] = [];
  public existingHobbies: string[] = [];

  public get isLoading(): Observable<boolean> {
    return this.loadingService.isLoading$;
  }

  constructor(
    private readonly router: Router,
    private readonly dialogRef: MatDialogRef<any>,
    private readonly loadingService: LoadingService,
    private readonly recommendationApiService: RecommendationApiService,
  ) { }

  public ngOnInit(): void {
    this.loadingService.startLoading();
    
    this.formGroup = new FormGroup({
      hobbyInput: new FormControl('')
    });

    this.recommendationApiService.getHobbiesList().subscribe((hobbies) => {
      this.existingHobbies = hobbies.map((hobby) => hobby.title);
      this.loadingService.stopLoading();
    }, () => {
      const hobbies = [{ "hobbyId": 1, "title": "Art" }, { "hobbyId": 2, "title": "Math" }, { "hobbyId": 3, "title": "Urban Planning" }, { "hobbyId": 4, "title": "Science" }, { "hobbyId": 5, "title": "Music" }, { "hobbyId": 6, "title": "Algebra" }, { "hobbyId": 7, "title": "Geometry" }, { "hobbyId": 8, "title": "Programming" }, { "hobbyId": 9, "title": "Robotics" }, { "hobbyId": 10, "title": "Sport" }, { "hobbyId": 11, "title": "Biotechnology" }, { "hobbyId": 12, "title": "Energetics" }, { "hobbyId": 13, "title": "Software" }, { "hobbyId": 14, "title": "Architecture" }, { "hobbyId": 15, "title": "Mechanics" }, { "hobbyId": 16, "title": "Management" }, { "hobbyId": 17, "title": "Economy" }, { "hobbyId": 18, "title": "Textile" }, { "hobbyId": 19, "title": "Clothing" }, { "hobbyId": 20, "title": "Machines" }, { "hobbyId": 21, "title": "Sewing" }, { "hobbyId": 22, "title": "Cooking" }, { "hobbyId": 23, "title": "Baking" }, { "hobbyId": 24, "title": "Driving" }, { "hobbyId": 25, "title": "Engineering" }, { "hobbyId": 26, "title": "Transport" }, { "hobbyId": 27, "title": "Communication" }, { "hobbyId": 28, "title": "Radio" }, { "hobbyId": 29, "title": "Computers" }, { "hobbyId": 30, "title": "Biomedicine" }, { "hobbyId": 31, "title": "Chemistry" }, { "hobbyId": 32, "title": "Design" }, { "hobbyId": 33, "title": "Right" }, { "hobbyId": 34, "title": "Law" }, { "hobbyId": 35, "title": "Construction" }, { "hobbyId": 36, "title": "Woodworking" }, { "hobbyId": 37, "title": "Politics" }, { "hobbyId": 38, "title": "Society" }, { "hobbyId": 39, "title": "Citizenship" }, { "hobbyId": 40, "title": "Geography" }, { "hobbyId": 41, "title": "Realty" }, { "hobbyId": 42, "title": "Accounting" }, { "hobbyId": 43, "title": "Marketing" }, { "hobbyId": 44, "title": "Business" }, { "hobbyId": 45, "title": "Administration" }, { "hobbyId": 46, "title": "Energy" }, { "hobbyId": 47, "title": "Industrial technologies" }, { "hobbyId": 48, "title": "Analytics" }, { "hobbyId": 49, "title": "Training" }, { "hobbyId": 50, "title": "Leadership" }];
      this.existingHobbies = hobbies.map((hobby) => hobby.title);
      this.loadingService.stopLoading();
    });

    this.filteredHobbies = this.formGroup.get('hobbyInput').valueChanges.pipe(
      map((hobby: string | null) => (hobby ? this._filter(hobby) : this.existingHobbies.slice())),
    );
  }

  public closeModal(): void {
    this.dialogRef.close();
  }

  public onSubmit(): void {
    this.loadingService.startLoading();

    this.recommendationApiService.getCustomSpecialtyRecommendations(this.selectedHobbies).subscribe((recommendations) => {
      this.dialogRef.close(true);
      this.loadingService.stopLoading();
    });
  }

  public add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim().toLowerCase();

    if (!value ||
      !this.existingHobbies.find(hobby => hobby.toLowerCase().includes(value)) ||
      this.selectedHobbies.find(hobby => hobby.toLowerCase().includes(value))) {
      return;
    }

    this.selectedHobbies.push(this.existingHobbies.find(hobby => hobby.toLowerCase().includes(value)));

    event.chipInput!.clear();

    this.formGroup.get('hobbyInput').setValue(null);
  }

  public remove(hobby: string): void {
    const index = this.selectedHobbies.indexOf(hobby);

    if (index >= 0) {
      this.selectedHobbies.splice(index, 1);
    }
  }

  public selected(event: MatAutocompleteSelectedEvent): void {
    const value = event.option.viewValue.toLowerCase();
    
    if (!value ||
      !this.existingHobbies.find(hobby => hobby.toLowerCase().includes(value)) ||
      this.selectedHobbies.find(hobby => hobby.toLowerCase().includes(value))) {
      return;
    }

    this.selectedHobbies.push(this.existingHobbies.find(hobby => hobby.toLowerCase().includes(value)));

    this.hobbyInput.nativeElement.value = '';

    this.formGroup.get('hobbyInput').setValue(null);
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.existingHobbies.filter(hobby => hobby.toLowerCase().includes(filterValue));
  }
}
