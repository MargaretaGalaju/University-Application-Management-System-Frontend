import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {
  public registerForm: FormGroup;
  public submitting: boolean = false;

  constructor(
    private readonly authService: AuthService,
  ) { }

  public ngOnInit(): void {
    this.registerForm = new FormGroup({
      username: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.email, Validators.required]),
      password: new FormControl('', [Validators.required]),
      confirmPassword: new FormControl('', [Validators.required]),
    }, { validators: this.checkPasswords })
  }

  public onSubmit(): void {
    if (!this.registerForm.valid) {
      return;
    }

    const postBody = {
      username: this.registerForm.value.username, 
      email: this.registerForm.value.email, 
      password: this.registerForm.value.password,
    }
    
    this.authService.register(postBody).subscribe(() => {
      this.submitting = false;
    }, () => {
      this.submitting = false;
    });
  }

  public checkPasswords: ValidatorFn = (group: AbstractControl):  ValidationErrors | null => { 
    if (!this.registerForm || !group.get('password') || !group.get('confirmPassword')) {
      return null;
    }

    let pass = group.get('password').value;
    let confirmPass = group.get('confirmPassword').value;
    this.registerForm.get('confirmPassword').setErrors(pass === confirmPass ? null : { notSame: true });
    
    return pass === confirmPass ? null : { notSame: true };
  }
}
