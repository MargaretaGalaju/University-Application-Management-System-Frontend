import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { User } from '../../models/user.model';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-personal-information',
  templateUrl: './personal-information.component.html',
  styleUrls: ['./personal-information.component.scss']
})
export class PersonalInformationComponent implements OnInit {
  @Input()
  public set user(value: User) {
    this._user = value;
    this.initForm(value);
  }

  public get user(): User {
    return this._user;
  }

  public profileForm: FormGroup;
  
  private _user: User;

  public fields = [
    {
      key: 'name',
      label: 'Name'
    }, 
    {
      key: 'gender',
      label: 'Gender'
    }, 
    {
      key: 'email',
      label: 'Email'
    }, 
    {
      key: 'phone',
      label: 'Phone'
    },
    {
      key: 'aboutMe',
      label: 'About Me'
    },
  ];

  constructor(
    private userService:UserService,
    private matSnackBar:MatSnackBar,
  ) { }

  public ngOnInit(): void {
  }

  public initForm(user: User): void {
    this.profileForm = new FormGroup({
      name: new FormControl(user.userName, [Validators.required]),
      gender: new FormControl(user.gender, []),
      email: new FormControl(user.email, [Validators.email]),
      phone: new FormControl(user.phone),
      aboutMe: new FormControl(user.aboutMe),
      hobbies: new FormControl(user.hobbies?.map((h)=>h.title) || [], []),
    });
  }

  public save(): void {
    const data = {...this.profileForm.value};

    data['hobbies'] = this.profileForm.value?.hobbies?.map((hobby) => ({
      hobbyId: null,
      title: hobby,
    }));

    this.userService.postUser(data).subscribe(() => {
      this.matSnackBar.open('Profile Updated Successfully!');
     
      this.userService.currentUser = {
        ...this.userService.currentUser,
        ...data,
      }
    })
  }
}
