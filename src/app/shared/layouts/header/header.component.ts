import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter, takeUntil } from 'rxjs/operators';
import { DestroyBase } from 'src/app/core/classes/destroy.class';
import { RouteEnum } from 'src/app/core/routes/routes.enum';
import { AuthService } from 'src/app/core/services/auth.service';

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
      title: 'About us',
      navigateUrl: RouteEnum.about,
    },
    {
      title: 'Support',
      navigateUrl: RouteEnum.support,
    },
  ];

  public currentRoute: RouteEnum;

  public isAuthentificated(): boolean {
    return this.authService.isAuthenticated();
  }

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router,
  ) {
    super();

    router.events.pipe(
      filter((event: any) => event instanceof NavigationEnd),
      takeUntil(this.destroy$),
      ).subscribe(event => {
        this.currentRoute = event.url.split('/')[1];
        console.log('this is what your looking for ', this.currentRoute);
      })
  }

  public ngOnInit(): void {

  }

}
