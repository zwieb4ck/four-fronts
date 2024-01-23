import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app.routes';
import { CommonModule } from '@angular/common';
import { PlanetComponent } from './views/planet/planet.component';
import { TileComponent } from './shared/tile/tile.component';
import { GridComponent } from './shared/grid/grid.component';
import UIService from './shared/services/UiService';

@NgModule({
    declarations: [
      AppComponent,
      PlanetComponent,
      TileComponent,
      GridComponent,
    ],
    imports: [
      BrowserModule,
      CommonModule,
      ReactiveFormsModule,
      FormsModule,
      HttpClientModule,
      AppRoutingModule,
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }