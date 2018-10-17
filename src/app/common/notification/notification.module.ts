import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NotificationService } from './services/notification.service';
import { NotificationComponent } from './components/notification/notification.component';
import { InquisiveNotificationComponent } from './components/inquisive-notification/inquisive-notification.component';
import { MaxPipe } from './pipe/maximum.pipe';
import { AppComponent } from './app.component';
@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [
        InquisiveNotificationComponent,
        NotificationComponent,
        MaxPipe,
        AppComponent
    ],
    providers: [NotificationService],
    exports: [InquisiveNotificationComponent]
})
export class NotificationModule {
    public static forRoot(): ModuleWithProviders {
        return {
            ngModule: NotificationModule,
            providers: [
                NotificationService
            ]
        };
    }
}

