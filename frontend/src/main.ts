import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';

import * as flowbite from 'flowbite';

flowbite.initFlowbite();

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch((err) => console.error(err));
