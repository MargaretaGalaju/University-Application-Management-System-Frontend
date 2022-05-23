import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { LoadingService } from 'src/app/core/services/loading.service';
import { UserService } from 'src/app/features/profile/services/user.service';

@Component({
  selector: 'app-application-stepper',
  templateUrl: './application-stepper.component.html',
  styleUrls: ['./application-stepper.component.scss']
})
export class ApplicationStepperComponent implements OnInit {
  public formGroup: FormGroup;

  public get isLoading(): Observable<boolean> {
    return this.loadingService.isLoading$;
  }

  public firstFormGroup: FormGroup;
  public secondFormGroup: FormGroup;
  public thirdFormGroup: FormGroup;
  public fourthFormGroup: FormGroup;
  public fifthFormGroup: FormGroup;

  public fields1: {label: string, formKey: string, isDatePicker: boolean}[];

  constructor(
    private _formBuilder: FormBuilder,
    private readonly router: Router,
    private readonly userService: UserService,
    private readonly loadingService: LoadingService,
  ) { }

  public ngOnInit(): void {
    this.secondFormGroup = this._formBuilder.group({
      secondCtrl: ['', Validators.required],
    });

    this.thirdFormGroup = this._formBuilder.group({
      secondCtrl: ['', Validators.required],
    });

    this.fourthFormGroup = this._formBuilder.group({
      secondCtrl: ['', Validators.required],
    });

    this.fifthFormGroup = this._formBuilder.group({
      secondCtrl: ['', Validators.required],
    });

    this.loadingService.stopLoading();

    this.userService.getUser().subscribe((user) => {
      this.firstFormGroup = new FormGroup({
        firstName: new FormControl(user.firstName, [Validators.required]),
        lastName: new FormControl(user.lastName, [Validators.required]),
        middleName: new FormControl(user.middleName, [Validators.required]),
        email: new FormControl(user.email, [Validators.email]),
        phone: new FormControl(user.phone),
        citizenship: new FormControl(user.citizenship, [Validators.required]),
        gender: new FormControl(user.gender, [Validators.required]),
        nationality: new FormControl(user.nationality, []),
        dateOfBirth: new FormControl(user.dateOfBirth, []),
        placeOfBirth: new FormControl(user.placeOfBirth, []),
        idCardSeriesNr: new FormControl(user.idCardSeriesNr, []),
        idDateOfIssue: new FormControl(user.idDateOfIssue, []),
      });

      this.fields1 = Object.keys(this.firstFormGroup.value).map((field) => {
        const label = field.split(/(?=[A-Z])/).map((a,i)=>{
          if(i===0) {
            let firstLetter = a.slice(0,1).toUpperCase();
            return `${firstLetter.concat(a.slice(1, a.length))}`
          }
          return a.toLowerCase()
        }).join(' ');

        const isDatePicker = ['dateOfBirth','placeOfBirth','idDateOfIssue'].includes(field);

        return {
          label, formKey:field, isDatePicker
        }
      });
    });
  }

  public onSubmit(): void {
    // this.recommendationApiService.getCustomSpecialtyRecommendations(this.selectedHobbies).subscribe((recommendations) => {
    //   this.dialogRef.close();
    // });
  }
}
