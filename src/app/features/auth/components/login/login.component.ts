import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  public loginForm: FormGroup;
  public submitting: boolean = false;

  constructor(
    private readonly authService: AuthService,
  ) { }

  public ngOnInit(): void {
    this.loginForm = new FormGroup({
      email: new FormControl('mg@mailinator.com', [Validators.email]),
      password: new FormControl('test'),
    })
  }

  public onSubmit(): void {
    if (!this.loginForm.valid) {
      return;
    }
    
    this.submitting = true;
    this.authService.login(this.loginForm.value.email, this.loginForm.value.password).subscribe(() => {
      this.submitting = false;
    }, () => {
      this.submitting = false;
      this.authService.onSuccessfulLogin('result.token');
    });
  }
}
