import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { RouteEnum } from './core/routes/routes.enum';
import { BasicLayoutComponent } from './shared/layouts/basic-layout/basic-layout.component';

const routes: Routes = [
  {
    path: RouteEnum.auth,
    loadChildren: () =>
      import('./features/auth/auth.module').then((m) => m.AuthModule),
  },
  {
    path: RouteEnum.profile,
    component: BasicLayoutComponent,
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./features/profile/profile.module').then((m) => m.ProfileModule),
  },
  {
    path: '',
    component: BasicLayoutComponent,
    loadChildren: () =>
      import('./features/home/home.module').then((m) => m.HomeModule),
  },
  {
    path: '**',
    redirectTo: ``,
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
