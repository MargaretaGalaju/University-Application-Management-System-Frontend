import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { RecommendationsDialogComponent } from 'src/app/shared/components/recommendations-dialog/recommendations-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { FacultyApiService } from 'src/app/core/services/faculty-api.service';
import { combineLatest, Observable } from 'rxjs';

@Component({
  selector: 'app-profile-layout',
  templateUrl: './profile-layout.component.html',
  styleUrls: ['./profile-layout.component.scss']
})
export class ProfileLayoutComponent implements OnInit {
  public user$: BehaviorSubject<User> = new BehaviorSubject<User>(null);

  public tasks: any[] = [];
  public profileForm: FormGroup;
  public favorites: any;
  public favoriteSpecialties;

  constructor(
    private readonly userService: UserService,
    private readonly facultyApiService: FacultyApiService,
    private readonly dialogService: MatDialog,
  ) { }

  public ngOnInit(): void {
    this.userService.getUser().subscribe((user) => {
      this.user$.next(user);

      this.initForm(user);
    });

    this.getFavoiritesFaculties();
  }

  public initForm(user: User): void {
    this.profileForm = new FormGroup({
      image: new FormControl(user.avatar, [Validators.required]),
      name: new FormControl(user.name, [Validators.required]),
      hobbies: new FormControl(user.hobbies?.map((v)=> v.title) || [], [Validators.required]),
      email: new FormControl('', [Validators.email]),
      phone: new FormControl(user.phone),
      aboutMe: new FormControl(''),
      recommendations: new FormControl(user.recommendations, []),
      favoriteSpecialties: new FormControl(user.favoriteSpecialties?.map((v)=> v.title) || [], [])
    });
  }
  
  public getRecommendations() {
    this.dialogService.open(RecommendationsDialogComponent)
  }

  public getFavoiritesFaculties() {
    combineLatest([
      this.facultyApiService.getAllFaculties(),
      this.facultyApiService.getAllFavorites()
    ])
    .subscribe(
      ([faculties, favorites]) => {
        this.favoriteSpecialties = faculties.map((faculty)=> ({
          ...faculty,
          specialties: faculty?.specialties?.filter((specialty) => !!favorites.find(f=> f.id === specialty.id))
        })).filter(f=> f?.specialties?.length)
      }
    );
  }

  deleteFromFavorites(specialtyId) {
    this.userService.removeFromFavoriteSpecialties(specialtyId).subscribe(() => {
      this.favoriteSpecialties =  this.favoriteSpecialties.map((faculty)=> ({
        ...faculty,
        specialties: faculty?.specialties?.filter((specialty) => specialty.id !==specialtyId)
      })).filter(f=> f?.specialties?.length)
    })
  }
}
