import { Component, Input, OnDestroy } from '@angular/core';
import { GoogleMapsService } from 'google-maps-angular2/dist';
import { FormGroup } from '@angular/forms';
import { ModuleEngineService } from '../../../services/module-engine.service';
import { Subscription } from 'rxjs/Subscription';

@Component({
    selector: 'app-map-renderer',
    templateUrl: './map-renderer.component.html',
    styleUrls: ['./map-renderer.component.scss']
})
export class MapRendererComponent implements OnDestroy {
    public subscriptions = new Subscription();
    public geocoder;
    public map;
    public group: FormGroup;

    constructor(public googleMapService: GoogleMapsService, public moduleEngineService: ModuleEngineService) {
        this.subscriptions.add(
            this.moduleEngineService.zipCode.subscribe((val) => {
                // tslint:disable-next-line:no-unused-expression
                !!val && this.mapInitialize(val);
            })
        );
    }

    /**
     * Function to initialize map
     *
     * @author Vishnu.bk <vishnu.bk@pitsolutions.com>
     */
    private mapInitialize(value): void {
        if (value) {
            document.getElementById('maptoggle').click();
            this.mapLocation(value, this.moduleEngineService.current_field);

        }
    }

    /**
       * Function to locate position on map and patch value
       *
       * @author Vishnu.bk <vishnu.bk@pitsolutions.com>
       */
    mapLocation(data, field) {
        this.googleMapService.init.then(maps => {
            this.geocoder = new maps.Geocoder();
            const latlng = new maps.LatLng(-34.397, 150.644);
            const mapOptions = {
                zoom: 13,
                center: latlng
            };
            if (!this.map) {
                this.map = new maps.Map(document.getElementById('map'), mapOptions);
            }
            const map = this.map;
            const self = this;
            this.geocoder.geocode({ 'address': data }, function (results, status) {
                if (status === 'OK') {
                    const latitude = results[0].geometry.location.lat();
                    const longitude = results[0].geometry.location.lng();
                    map.setCenter(results[0].geometry.location);
                    const marker = new maps.Marker({
                        map: map,
                        position: results[0].geometry.location
                    });
                    if (self.moduleEngineService.formGroup.controls[field]) {
                        const group = self.moduleEngineService.formGroup.controls[field]['controls'][self.moduleEngineService.index].controls;
                        group.company_latitude.patchValue(latitude);
                        group.company_longitude.patchValue(longitude);
                    }
                } else {

                }
            });
        });
    }

    ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }
}
