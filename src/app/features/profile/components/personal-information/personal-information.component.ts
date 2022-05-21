import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from '../../models/user.model';

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

  constructor() { }

  public ngOnInit(): void {
  }

  
  public initForm(user: User): void {
    this.profileForm = new FormGroup({
      image: new FormControl(user.avatar, [Validators.required]),
      name: new FormControl(user.name, [Validators.required]),
      gender: new FormControl(user.gender, []),
      email: new FormControl(user.email, [Validators.email]),
      phone: new FormControl(user.phone),
      aboutMe: new FormControl(user.aboutMe),
      hobbies: new FormControl(user.hobbies.map((v)=> v.title), []),
      favoriteSpecialties: new FormControl(user.favoriteSpecialties, [])
    });

    console.log(this.profileForm);
    
  }
}
