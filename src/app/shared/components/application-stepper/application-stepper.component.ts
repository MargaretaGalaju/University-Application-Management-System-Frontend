import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { combineLatest, Observable } from 'rxjs';
import { FacultyApiService } from 'src/app/core/services/faculty-api.service';
import { LoadingService } from 'src/app/core/services/loading.service';
import { UserService } from 'src/app/features/profile/services/user.service';
import { Faculty } from '../../models/faculty.model';

export interface Task {
  name: string;
  checked: boolean;
  color: string;
  subtasks?: Task[];
}
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

  public faculties: any[] = [];

  public firstFormGroup: FormGroup;
  public secondFormGroup: FormGroup;
  public thirdFormGroup: FormGroup;
  public fourthFormGroup: FormGroup;
  public fifthFormGroup: FormGroup;

  public fields1: { label: string, formKey: string, isDatePicker: boolean }[];
  public tasks: Task[] = []

  public task: Task = {
    name: 'Indeterminate',
    checked: false,
    color: 'primary',
    subtasks: [
      { name: 'Primary', checked: false, color: 'accent' },
      { name: 'Accent', checked: false, color: 'accent' },
      { name: 'Warn', checked: false, color: 'accent' },
    ],
  };

  constructor(
    private readonly _formBuilder: FormBuilder,
    private readonly router: Router,
    private readonly userService: UserService,
    private readonly facultyApiService: FacultyApiService,
    private readonly loadingService: LoadingService,
    private _snackBar: MatSnackBar
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
        const label = field.split(/(?=[A-Z])/).map((a, i) => {
          if (i === 0) {
            let firstLetter = a.slice(0, 1).toUpperCase();
            return `${firstLetter.concat(a.slice(1, a.length))}`
          }

          return a.toLowerCase()
        }).join(' ');

        const isDatePicker = ['dateOfBirth', 'placeOfBirth', 'idDateOfIssue'].includes(field);

        return {
          label, formKey: field, isDatePicker
        }
      });
    });

    combineLatest([
      this.facultyApiService.getAllFaculties(),
      this.facultyApiService.getAllFavorites()
    ])
    .subscribe(
      ([faculties, favorites]) => {
        this.faculties = faculties;

        this.faculties.forEach((faculty) => {
          this.tasks.push({
            name: faculty.title,
            checked: this.getAllComplete(faculty.specialties?.map((specialty) => ({
              name: specialty.title,
              checked: !!favorites.find((favSpecialty) => favSpecialty.id === specialty.id),
              color: 'accent'
            }))),
            color: 'primary',
            subtasks: faculty.specialties?.map((specialty) => ({
              name: specialty.title,
              checked: !!favorites.find((favSpecialty) => favSpecialty.id === specialty.id),
              color: 'accent'
            })),
          })
        });
      }
    );
  }

  getAllComplete(task) {
    return task.subtasks != null && task.subtasks.every(t => t.checked);
  }

  someComplete(task): boolean {
    if (task.subtasks == null) {
      return false;
    }

    return task.subtasks.filter(t => t.checked).length > 0;
  }

  setAll(checked: boolean, task) {
    if (task.subtasks == null) {
      return;
    }

    task.subtasks.forEach(t => (t.checked = checked));
  }

  public onSubmit(): void {
    if (!this.userService.currentUser?.hobbies?.length) {
      return;
    }

    const choosedSpecialties = [];
    this.tasks.forEach((task) => {
      task.subtasks.forEach((subtask) => {
        if (subtask.checked) {
          choosedSpecialties.push(subtask.name);
        }
      })
    });
    const hobbbies = this.userService.currentUser?.hobbies.map((hobby) => hobby.title);
    
    const finalData = [];

    hobbbies.forEach((hobby) => {
      choosedSpecialties.forEach((specialtyTitile) => {
        finalData.push({
          hobby,
          specialtyTitile,
        });
      });
    });

    this.userService.submitApplication(finalData).subscribe(() => {
      this._snackBar.open('Successfully applied!');
      this.router.navigateByUrl(`/home`);
    });
  }
}
