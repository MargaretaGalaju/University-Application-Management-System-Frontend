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

  constructor(
    private readonly authService: AuthService,
  ) { }

  public ngOnInit(): void {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.email]),
      password: new FormControl(''),
    })
  }

  public onSubmit(): void {
    if (!this.loginForm.valid) {
      return;
    }
    
    this.authService.login(this.loginForm.value.email, this.loginForm.value.password).subscribe();
  }
}
