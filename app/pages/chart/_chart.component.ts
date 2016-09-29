import { Component, NgZone, AfterViewInit, OnDestroy } from '@angular/core';
//import { Chart } from './chart.model';

@Component({
    selector: 'chart',
    inputs: ['chart'],
    template: '<div class="chart">jooo</div>'
})
export class Chart implements AfterViewInit, OnDestroy {
    //chart: Chart

    constructor (private zone: NgZone) { }

    ngAfterViewInit () {
        //this.zone.runOutsideAngular(() => chart.render(this.chart));
    }

    ngOnDestroy () {

        //chart.exec(this.chart.id, 'destroy');
    }
}