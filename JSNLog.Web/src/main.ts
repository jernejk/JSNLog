import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import { JL } from 'jsnlog';

// This will prevent undesired error swallowing and unnecessary errors when Angular isn't bootstrapped correctly.
JL().setOptions({ 'appenders': [], 'level': JL.getOffLevel() });

// Prevent JSNLog to take over onerror which causes to swallow the entire error log if the bootstrapping Angular failed.
window.onerror = function (event) { };

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.log(err));
