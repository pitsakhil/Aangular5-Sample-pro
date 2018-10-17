import { TestBed, async } from '@angular/core/testing';
import { Router, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { AppComponent } from './app.component';
import { AppModule } from './app.module';

describe('AppComponent', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
            ],
            imports: [AppModule, TranslateModule.forRoot()],
            providers: [{ provide: Router, useValue: '/home' }]

        }).compileComponents();
    }));
    // fit('should create the app', async(() => {
    //   const fixture = TestBed.createComponent(AppComponent);
    //   const app = fixture.debugElement.componentInstance;
    //   expect(app).toBeTruthy();
    // }));

});
