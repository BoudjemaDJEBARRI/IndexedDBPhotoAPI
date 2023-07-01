import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
// Importer defineCustomElements 
import { defineCustomElements } from '@ionic/pwa-elements/loader';
// Appeler le chargeur d'éléments après le démarrage de la plateforme
defineCustomElements(window);

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.log(err));
