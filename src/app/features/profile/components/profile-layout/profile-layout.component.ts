import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { RecommendationsDialogComponent } from 'src/app/shared/components/recommendations-dialog/recommendations-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { FacultyApiService } from 'src/app/core/services/faculty-api.service';

@Component({
  selector: 'app-profile-layout',
  templateUrl: './profile-layout.component.html',
  styleUrls: ['./profile-layout.component.scss']
})
export class ProfileLayoutComponent implements OnInit {
  public user$: BehaviorSubject<User> = new BehaviorSubject<User>(null);
 
  public profileForm: FormGroup;
  public favorites: any;

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

    this.facultyApiService.getAllFavorites().subscribe((favorites) => {
      this.favorites = favorites;
    });
  }

  public initForm(user: User): void {
    this.profileForm = new FormGroup({
      image: new FormControl(user.avatar, [Validators.required]),
      name: new FormControl(user.name, [Validators.required]),
      hobbies: new FormControl(user.hobbies.map((v)=> v.title), [Validators.required]),
      email: new FormControl('', [Validators.email]),
      phone: new FormControl(user.phone),
      aboutMe: new FormControl(''),
      recommendations: new FormControl(user.recommendations, []),
      favoriteSpecialties: new FormControl(user.favoriteSpecialties.map((v)=> v.title), [])
    });
  }
  
  public getRecommendations() {
    this.dialogService.open(RecommendationsDialogComponent)
  }

}
