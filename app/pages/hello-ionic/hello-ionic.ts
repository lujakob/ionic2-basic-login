import {Component, AfterViewInit} from '@angular/core';
//import { Chart } from './chart.component';
import { CHART_DIRECTIVES } from 'angular2-highcharts';
import { ChartService } from './chart.service';


@Component({
  templateUrl: 'build/pages/hello-ionic/hello-ionic.html',
  directives: [CHART_DIRECTIVES],
    providers: [ChartService],
    styles: [`
      chart {
        display: block;
        width: 100%
      }
    `]
})
export class HelloIonicPage implements AfterViewInit{
  private chartData: any[];
  private errorMessage: any;
  options: HighchartsOptions;
  chart : HighchartsChartObject;
  constructor(private chartService: ChartService) {

      // this.options = {
      //     title : { text : 'simple chart' },
      //     series: [{
      //         data: [29.9, 71.5, 106.4, 129.2],
      //     }]
      // };
      //setTimeout(() => this.chart.reflow(), 5000);
      //setInterval(() => this.chart.series[0].addPoint(Math.random() * 10), 1000);
        this.chartData = [29.9, 71.5, 106.4, 129.2];

  }

    ngAfterViewInit() {
        // this.chart.reflow();
        // console.log("reflow after view");

        this.initChart();
    }
    initChart() {

        this.chartService.getChartData()
            .subscribe(
                (data) => {
                    //console.log(data);
                    this.options = {
                        chart: {
                            type: 'column',
                            height: 400,
                            backgroundColor: '#333',
                            spacing: [10,20,0,10]
                        },
                        tooltip: {
                            enabled: false
                        },
                        // title: {
                        //     style:{"display": "none"}
                        // },
                        // subtitle: {
                        //     style:{"display": "none"}
                        // },
                        // credits: {
                        //     enabled: false
                        // },
                        xAxis: {
                            visible:false,
                            //categories: ['Africa', 'America', 'Asia', 'Europe', 'Oceania'],
                            title: {
                                text: null
                            }
                        },
                        yAxis: {
                            title: {
                                text: null
                            }
                            //visible:false
                        },
                        legend: {
                            enabled: false
                        },
                        // plotOptions: {
                        //     column: {
                        //         pointPadding: 0,
                        //         borderWidth: 0,
                        //         groupPadding:0
                        //     },
                        //     series: {
                        //         pointWidth:20,
                        //     }
                        // },
                        series: [{
                            data: data,
                            // data: [29.9, 71.5, 106.4, 129.2],
                        }]
                    };

                },
                error =>  this.errorMessage = <any>error);

    }
    saveInstance(chartInstance) {
        // this.chart = chartInstance;
        // this.chart.reflow();
        // console.log("reflow");
    }

}


// this.options = {
//     chart: {
//         type: 'column',
//         height: 400,
//         backgroundColor: '#333',
//         spacing: [10,20,0,10]
//     },
//     tooltip: { enabled: false },
//     title: {
//         style:{"display": "none"}
//     },
//     subtitle: {
//         style:{"display": "none"}
//     },
//     credits: {
//         enabled: false
//     },
//
//     xAxis: {
//         visible:false,
//         //categories: ['Africa', 'America', 'Asia', 'Europe', 'Oceania'],
//         title: {
//             text: null
//         }
//     },
//     yAxis: {
//         title: {
//             text: null
//         }
//         //visible:false
//     },
//     legend: {
//         enabled: false
//     },
//     plotOptions: {
//         column: {
//             pointPadding: -5,
//             borderWidth: 0,
//             groupPadding:0
//         },
//         series: {
//             pointWidth:20,
//         }
//     },
//     series: [{
//         name: 'Performance',
//         data: [89.9],
//         color:'#ff00ff'
//
//     }, {
//         name: 'Digital/New Media',
//         data: [63.6],
//         color: '#F8E71C'
//
//     }, {
//         name: 'Mechanical',
//         data: [73.6],
//         color:'#7ED321'
//
//     }, {
//         name: 'Sync',
//         data: [53.6],
//         color:'#F5A623'
//     }, {
//         name: 'Others',
//         data: [43.6],
//         color:'#4A90E2'
//     }]
// };