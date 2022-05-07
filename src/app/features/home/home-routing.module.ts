import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RouteEnum } from 'src/app/core/routes/routes.enum';
import { MapComponent } from './components/map/map.component';
import { VirtualTourComponent } from './components/virtual-tour/virtual-tour.component';

const routes: Routes = [
  {
    path: '', 
    component: MapComponent,
  },
  {
    path: `${RouteEnum.virtualTour}`,
    component: VirtualTourComponent,
  },
  {
    path: `${RouteEnum.virtualTour}/:id`,
    component: VirtualTourComponent,
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
