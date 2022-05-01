import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { JwtHelperService } from '@auth0/angular-jwt';
import { AuthGuard } from './guards/auth.guard';
import { AuthService } from './services/auth.service';

@NgModule({
  declarations: [
  ],
  imports: [
  ],
  providers: [
    JwtHelperService,
    AuthGuard,
    AuthService,
  ],
})
export class CoreModule {
}
