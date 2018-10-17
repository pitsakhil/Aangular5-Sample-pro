import { NgModule } from '@angular/core';
import { BrowserModule, HAMMER_GESTURE_CONFIG, HammerGestureConfig } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';;
import { CoreModule } from './core/core.module';
import { AppComponent } from './app.component';
import { routing } from './app.routing';
import { CookieModule } from '../../node_modules/ngx-cookie';
import { ProjectModule } from './modules/projects/project.module';
import { SharedModule } from './common/shared/shared.module';


export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}
export class MyHammerConfig extends HammerGestureConfig {
    overrides = <any>{
        'pinch': { enable: false },
        'rotate': { enable: false }
    };
}
@NgModule({
    declarations: [AppComponent],
    imports: [
        BrowserModule,
        RouterModule,
        HttpClientModule,
        SharedModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpClient]
            }
        }),
        routing,
        CoreModule,
        BrowserAnimationsModule,
        ProjectModule,
        CookieModule.forRoot()
    ],
    providers: [{
        provide: HAMMER_GESTURE_CONFIG,
        useClass: MyHammerConfig
    }],
    bootstrap: [AppComponent]
})
export class AppModule { }
