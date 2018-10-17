import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { TogglePanelOptions, GridValues } from './../models/appstate.model';

@Injectable()
export class ToggleService {

    public togglePanelOptions: TogglePanelOptions;
    public gridValues: GridValues;
    public gridNum: number;
    public listenMainContent: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    public isOverlayActive: boolean;

    constructor() { }

    public initToggleState(tState: TogglePanelOptions, tGridValue: GridValues) {
        this.togglePanelOptions = JSON.parse(JSON.stringify(tState));
        this.gridValues = JSON.parse(JSON.stringify(tGridValue));
        this.makeGrid(this.gridValues);
    }

    public toggle(toggleType: string): void {
        switch (toggleType) {
            case 'navbar':
                return this.makeGrid(this.gridValues, toggleType, 4);
            case 'tablebar':
            case 'rightbar':
                return this.makeGrid(this.gridValues, toggleType, 5);
            case 'navbaroverlay':
            case 'rightbaroverlay':
                return this.setGridActiveOrNot(toggleType, !this.togglePanelOptions[`${toggleType}`]);
            default:
                return undefined;
        }
    }

    public checkGridActive(type?: string) {
        return this.togglePanelOptions ? this.togglePanelOptions[`${type}`] : false;
    }

    public setGridActiveOrNot(type?: string, value?: boolean) {
        // tslint:disable-next-line:no-unused-expression
        (type === 'maincontent') && this.listenMainContent.next(value);
        this.togglePanelOptions[`${type}`] = value;
        localStorage.setItem('layout_options', JSON.stringify(this.togglePanelOptions));
    }
    public checkOverlayActive() {
        return this.isOverlayActive;
    }

    public setOverlayActiveOrNot(flag?: boolean) {
        this.isOverlayActive = !!flag;
    }

    public onToggleUserIcon(close?: boolean, isClosest?: any) {
        const x = document.getElementById('userInfo-toggle');
        if (x.className.indexOf('open') === -1 && !close) {
            x.className += ' open';
            this.setOverlayActiveOrNot(true);
        } else {
            x.className = x.className.replace('open', '');
            // tslint:disable-next-line:no-unused-expression
            (!isClosest) && this.setOverlayActiveOrNot(false);
        }
    }
    public setGridStatus(type?: string, val?: boolean, gridVal?: number) {
        this.togglePanelOptions[`${type}`] = val;
        this.gridValues[`${type}`] = val ? 0 : gridVal;
        const gridNum = Object.values(this.gridValues).reduce((sum, num) => sum + num, 0);
        this.gridNum = gridNum;
        localStorage.setItem('layout_options', JSON.stringify(this.togglePanelOptions));
        localStorage.setItem('layout_options_num', gridNum);
    }

    public mainContentClose() {
        this.listenMainContent.next(false);
        this.setGridActiveOrNot('maincontent', false);
        this.setGridStatus('rightbar', false, 5);
        this.setGridStatus('tablebar', true, 5);
        this.setGridStatus('navbar', true, 4);
    }

    public initComposeToggle() {
        this.setGridStatus('tablebar', false, 5);
        this.setGridStatus('rightbar', false, 5);
        this.setGridStatus('navbar', true, 4);
        this.setGridActiveOrNot('rightbaroverlay', false);
    }

    public makeGrid(gridValues: object, gridType?: string, gridVal?: number): void {
        if (!!gridType) {
            const val = this.togglePanelOptions[`${gridType}`];
            this.togglePanelOptions[`${gridType}`] = !val;
            gridValues[`${gridType}`] = !val ? 0 : gridVal;
        }
        const gridNum = Object.values(gridValues).reduce((sum, num) => sum + num, 0);
        this.gridNum = gridNum;
        localStorage.setItem('layout_options', JSON.stringify(this.togglePanelOptions));
        localStorage.setItem('layout_options_num', gridNum);
    }

    public getGridVal(): number {
        return this.gridNum;
    }

    public hideOverlay(): void {
        const overlayGrids = ['navbaroverlay', 'rightbaroverlay'];
        overlayGrids.forEach((grid) => {
            if (this.checkGridActive(`${grid}`)) {
                this.toggle(`${grid}`);
            }
        });
    }
}
