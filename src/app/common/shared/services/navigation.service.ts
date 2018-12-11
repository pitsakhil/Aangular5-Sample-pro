import { Injectable, OnInit } from '@angular/core';
// import { InquisivDashboardRoutingTest } from '../../../core/constants/app-routing';


@Injectable()
export class NavigationService {
  public domainName: any;
  constructor() {
    this.domainName = window.location.hostname.substring(window.location.hostname.lastIndexOf('.', window.location.hostname.lastIndexOf('.') - 1) + 1);
  }

//   public setUrl() {
//     if (this.domainName === 'localhost') {
//       return InquisivDashboardRoutingTest;
//     }
//   }


}
