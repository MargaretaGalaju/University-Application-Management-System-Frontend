import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { EngineService } from '../engine.service';

@Component({
  selector: 'app-engine',
  styleUrls: ['./engine.component.scss'],
  templateUrl: './engine.component.html'
})
export class EngineComponent implements OnInit {
  @ViewChild('rendererCanvas', {static: true})
  public rendererCanvas: ElementRef<HTMLCanvasElement>;

  constructor(
    private readonly engineService: EngineService,
  ) { 
  }

  public ngOnInit(): void {
    this.createScene();
  }

  public createScene() {
    this.engineService.createScene(this.rendererCanvas);
  }
}
