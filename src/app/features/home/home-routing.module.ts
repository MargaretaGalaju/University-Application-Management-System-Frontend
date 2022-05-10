import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RouteEnum } from 'src/app/core/routes/routes.enum';
import { MapComponent } from './components/map/map.component';
import { RecomendationsComponent } from './components/recomendations/recomendations.component';
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
    path: `${RouteEnum.recommendations}`,
    //Add a resolver, if no recommedations in profile or send in url state, navigate to home page
    // resolve: [],
    component: RecomendationsComponent,
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
