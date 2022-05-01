import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { AuthGuard } from './core/guards/auth.guard';
import { RouteEnum } from './core/routes/routes.enum';
import { EngineComponent } from './engine/components/engine.component';
import { BasicLayoutComponent } from './shared/layouts/basic-layout/basic-layout.component';

const routes: Routes = [
  {
    path: RouteEnum.auth,
    loadChildren: () =>
      import('./features/auth/auth.module').then((m) => m.AuthModule),
  },
  {
    path: RouteEnum.home,
    // component: BasicLayoutComponent,
    loadChildren: () =>
      import('./features/home/home.module').then((m) => m.HomeModule),
  },
  {
    path: RouteEnum.profile,
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./features/profile/profile.module').then((m) => m.ProfileModule),
  },
  // {
  //   path: '',
  //   pathMatch: 'full',
  //   redirectTo: `/${RouteEnum.home}/${RouteEnum.map}`,
  // },
  // {
  //   path: '**',
  //   redirectTo: `/${RouteEnum.home}/${RouteEnum.map}`,
  // }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
