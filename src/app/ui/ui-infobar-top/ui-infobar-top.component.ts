import { Component, OnInit } from '@angular/core';
import { UiActionService } from 'src/app/shared/services/ui-action.service';

@Component({
  selector: 'app-ui-infobar-top',
  templateUrl: './ui-infobar-top.component.html',
  styleUrls: ['./ui-infobar-top.component.scss'],
})
export class UiInfobarTopComponent implements OnInit {
  public  enableFullNavigation: boolean = true;

  constructor(
    private readonly uiAction: UiActionService
  ) {
  }

  public ngOnInit(): void {
  }

  public toggleFullNavigation(): void {
    this.enableFullNavigation = !this.enableFullNavigation;
    this.uiAction.toggleFullNavigation(this.enableFullNavigation);
  }
}
