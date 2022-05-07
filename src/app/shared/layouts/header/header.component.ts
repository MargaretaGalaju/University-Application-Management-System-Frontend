import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NavigationEnd, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { Subject } from 'rxjs/internal/Subject';
import { filter, switchMap, takeUntil } from 'rxjs/operators';
import { DestroyBase } from 'src/app/core/classes/destroy.class';
import { RouteEnum } from 'src/app/core/routes/routes.enum';
import { AuthService } from 'src/app/core/services/auth.service';
import { RecommendationsDialogComponent } from '../../components/recommendations-dialog/recommendations-dialog.component';

interface NavItem {
  title: string;
  navigateUrl: string;
}
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent extends DestroyBase implements OnInit {
  public navItems: NavItem[] = [
    {
      title: 'Home',
      navigateUrl: RouteEnum.home,
    },
    {
      title: 'Virtual tours',
      navigateUrl: RouteEnum.virtualTour,
    },
    {
      title: 'Application process',
      navigateUrl: RouteEnum.applicationProcess,
    },
  ];

  public currentRoute$: BehaviorSubject<RouteEnum> = new BehaviorSubject<RouteEnum>(null);

  public isAuthentificated(): boolean {
    return this.authService.isAuthenticated();
  }

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly dialog: MatDialog,
    private readonly cdr: ChangeDetectorRef,
  ) {
    super();

    router.events.pipe(
      filter((event: any) => event instanceof NavigationEnd),
      takeUntil(this.destroy$),
      ).subscribe(event => {
        this.currentRoute$.next(event.url.split('/')[1] || RouteEnum.home);
      });
  }

  public ngOnInit(): void {
    // this.currentRoute$.next(this.currentRoute$.getValue())
  }

  public openRecommendationsDialog():void {
    this.dialog.open(RecommendationsDialogComponent)
  }

  public redirectToLoginPage(): void {
    this.router.navigateByUrl(`/${RouteEnum.auth}/${RouteEnum.login}`);
  }
}
