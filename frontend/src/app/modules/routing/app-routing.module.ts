import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminGuard } from 'src/app/core/guards/admin.guard';
import { DashboardPageComponent } from 'src/app/views/dashboard/dashboard.component';
import { LoginComponent } from 'src/app/views/login/login/login.component';
import { RegisterComponent } from 'src/app/views/register/register.component';
import { NotFoundComponent } from 'src/app/views/not-found/not-found.component';
import { UnauthorizedComponent } from 'src/app/views/unauthorized/unauthorized.component';
import { ForgotPasswordComponent } from 'src/app/views/login/forgot-password/forgot-password.component';
import { SolarSystemComponent } from 'src/app/views/dashboard/solar-system/solar-system.component';
import { PlanetComponent } from 'src/app/views/dashboard/planet/planet.component';
import { QuadrantComponent } from 'src/app/views/dashboard/quadrant/quadrant.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: '/login',
  },
  {
    path: 'dashboard',
    component: DashboardPageComponent,
    children: [
      {
        path: ':quadrant',
        component: QuadrantComponent,
      },
      {
        path: ':quadrant/:system',
        component: SolarSystemComponent,
        data: {
          name: 'SolarSystem',
        }
        
      },
      {
        path: ':quadrant/:system/:planet',
        component: PlanetComponent,
        data: {
          name: 'Planet',
        }
      }

    ]
  },
  {
    path: 'login',
    children: [
      {
        path: '',
        component: LoginComponent,
      },
      {
        path: ':refresh',
        component: LoginComponent,
      },
    ],
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: 'forgot-password',
    component: ForgotPasswordComponent,
  },
  {
    path: 'unauthorized',
    component: UnauthorizedComponent,
  },
  {
    path: 'notfound',
    component: NotFoundComponent,
  },
  {
    path: '**',
    redirectTo: '/notfound',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
