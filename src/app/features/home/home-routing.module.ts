import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RouteEnum } from 'src/app/core/routes/routes.enum';
import { MapComponent } from './components/map/map.component';

const routes: Routes = [
  {
    path: '', 
    redirectTo: RouteEnum.map,
    pathMatch: 'full'
  },
  {
    path: RouteEnum.map,
    component: MapComponent,
  },
  {
    path: '**',
    redirectTo: RouteEnum.map,
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
