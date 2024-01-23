import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PlanetComponent } from './views/planet/planet.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: '/planet',
  },
  {
    path: 'planet',
    component: PlanetComponent,
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}