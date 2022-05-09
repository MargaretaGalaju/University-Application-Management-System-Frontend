import { Injectable } from '@angular/core';
import { EngineService } from 'src/app/core/services/3d-map/engine.service';

@Injectable({
  providedIn: 'root'
})
export class UiActionService {

  constructor(
    private readonly engineService: EngineService,
  ) { }

  public toggleFullNavigation(enableFullNavigation: boolean) {
    this.engineService.toggleUIControls(enableFullNavigation);
  }
}
