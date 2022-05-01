import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {AppComponent} from './app.component';
import {EngineComponent} from './engine/components/engine.component';
import {UiInfobarBottomComponent} from './ui/ui-infobar-bottom/ui-infobar-bottom.component';
import {UiInfobarTopComponent} from './ui/ui-infobar-top/ui-infobar-top.component';
import {UiSidebarLeftComponent} from './ui/ui-sidebar-left/ui-sidebar-left.component';
import {UiSidebarRightComponent} from './ui/ui-sidebar-right/ui-sidebar-right.component';
import {UiComponent} from './ui/ui.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { AppRoutingModule } from './app-routing.module';
import { CoreModule } from './core/core.module';
import { HttpClientModule } from '@angular/common/http';
import { JwtModule } from '@auth0/angular-jwt';
import { SharedModule } from './shared/shared.module';

export function tokenGetter() {
  return localStorage.getItem('access_token');
}

@NgModule({
  declarations: [
    AppComponent,
    EngineComponent,
    UiComponent,
    UiInfobarBottomComponent,
    UiInfobarTopComponent,
    UiSidebarLeftComponent,
    UiSidebarRightComponent,
  ],
  imports: [
    BrowserModule,
    CoreModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatProgressSpinnerModule,
    HttpClientModule,
    SharedModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        allowedDomains: ['localhost'],
      },
    }),
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
