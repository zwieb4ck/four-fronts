import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { NotFoundComponent } from './views/not-found/not-found.component';
import { UnauthorizedComponent } from './views/unauthorized/unauthorized.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './views/login/login/login.component';
import { AppRoutingModule } from './modules/routing/app-routing.module';
import { AuthInterceptor } from './core/interceptors/auth-interceptor';
import { ErrorInterceptor } from './core/interceptors/error-interceptor';
import { AdminGuard } from './core/guards/admin.guard';
import { CommonModule } from '@angular/common';
import { IconComponent } from './components/icon.component';
import { DashboardPageComponent } from './views/dashboard/dashboard.component';
import { RegisterComponent } from './views/register/register.component';
import { ForgotPasswordComponent } from './views/login/forgot-password/forgot-password.component';
import { GridComponent } from './components/grid/grid.component';
import { TileComponent } from './components/tile/tile.component';
import { OverlayComponent } from './components/overlay/overlay.component';
import { SolarSystemComponent } from './views/dashboard/solar-system/solar-system.component';
import { PlanetComponent } from './views/dashboard/planet/planet.component';
import { QuadrantComponent } from './views/dashboard/quadrant/quadrant.component';
import { GameComponent } from './views/game/game.component';
import { SystemComponent } from './views/game/views/system/system.component';
import { BodyComponent } from './views/game/views/body/body.component';
import { BreadcrumpComponent } from './views/game/components/breadcrump/breadcrump.component';

@NgModule({
  declarations: [
    AppComponent,
    DashboardPageComponent,
    NotFoundComponent,
    UnauthorizedComponent,
    LoginComponent,
    IconComponent,
    RegisterComponent,
    ForgotPasswordComponent,
    GridComponent,
    TileComponent,
    OverlayComponent,
    SolarSystemComponent,
    PlanetComponent,
    QuadrantComponent,
    GameComponent,
    SystemComponent,
    BodyComponent,
    BreadcrumpComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    AdminGuard,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
