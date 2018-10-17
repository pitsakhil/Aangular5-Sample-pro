import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import 'hammerjs';
import { LicenseManager } from 'ag-grid-enterprise/main';
LicenseManager.setLicenseKey('Sientia_AG_Scayla_8Devs7_June_2019__MTU1OTg2MjAwMDAwMA==c30d26e96f1f4878f80301cac651579d');

if (environment.production) {
    enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
    .then(ref => {
        if (window['ngRef']) {
            window['ngRef'].destroy();
        }
        window['ngRef'] = ref;
    })
    .catch(err => console.log(err));
