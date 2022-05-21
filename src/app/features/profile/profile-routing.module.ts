import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfileLayoutComponent } from './components/profile-layout/profile-layout.component';

const routes: Routes = [
  {
    path: '',
    component: ProfileLayoutComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProfileRoutingModule { }
