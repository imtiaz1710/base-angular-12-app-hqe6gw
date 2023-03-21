import {
  AfterViewInit,
  Component,
  Inject,
  NgZone,
  OnInit,
  PLATFORM_ID,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

// amCharts imports
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';

import * as am4maps from '@amcharts/amcharts4/maps';
import am4geodata_worldLow from '@amcharts/amcharts4-geodata/worldLow';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements AfterViewInit {
  private chart: am4charts.XYChart;

  constructor(@Inject(PLATFORM_ID) private platformId, private zone: NgZone) {}
  ngAfterViewInit(): void {
    /* Create map instance */
    var chart = am4core.create('chartdiv', am4maps.MapChart);

    /* Set map definition */
    chart.geodata = am4geodata_worldLow;

    /* Set projection */
    chart.projection = new am4maps.projections.Miller();

    var polygonSeries = chart.series.push(new am4maps.MapPolygonSeries());

    /* Make map load polygon (like country names) data from GeoJSON */
    polygonSeries.useGeodata = true;

    /* Configure series */
    var polygonTemplate = polygonSeries.mapPolygons.template;
    polygonTemplate.tooltipText = '{name}';
    polygonTemplate.fill = am4core.color('#74B266');
    polygonTemplate.events.on('hit', function (ev) {
      ev.target.series.chart.zoomToMapObject(ev.target);
    });

    /* Create hover state and set alternative fill color */
    var hs = polygonTemplate.states.create('hover');
    hs.properties.fill = am4core.color('#367B25');

    // No thanks, Antarctica, no thanks.
    polygonSeries.exclude = ['AQ'];

    chart.zoomControl = new am4maps.ZoomControl();

    var buttonTopPosition;
  }

  ngOnInit(): void {}

  // // Run the function only in the browser
  // browserOnly(f: () => void) {
  //   if (isPlatformBrowser(this.platformId)) {
  //     this.zone.runOutsideAngular(() => {
  //       f();
  //     });
  //   }
  // }

  // ngAfterViewInit() {
  //   // Chart code goes in here
  //   this.browserOnly(() => {
  //     am4core.useTheme(am4themes_animated);

  //     //let chart = am4core.create("chartdiv", am4charts.XYChart);
  //     let map = am4core.create('chartdiv', am4maps.MapChart);
  //     map.geodata = am4geodata_worldLow;
  //     // chart.paddingRight = 20;

  //     // let data = [];
  //     // let visits = 10;
  //     // for (let i = 1; i < 366; i++) {
  //     //   visits += Math.round((Math.random() < 0.5 ? 1 : -1) * Math.random() * 10);
  //     //   data.push({ date: new Date(2018, 0, i), name: "name" + i, value: visits });
  //     // }

  //     // chart.data = data;

  //     // let dateAxis = chart.xAxes.push(new am4charts.DateAxis());
  //     // dateAxis.renderer.grid.template.location = 0;

  //     // let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
  //     // valueAxis.tooltip.disabled = true;
  //     // valueAxis.renderer.minWidth = 35;

  //     // let series = chart.series.push(new am4charts.LineSeries());
  //     // series.dataFields.dateX = "date";
  //     // series.dataFields.valueY = "value";
  //     // series.tooltipText = "{valueY.value}";

  //     // chart.cursor = new am4charts.XYCursor();

  //     // let scrollbarX = new am4charts.XYChartScrollbar();
  //     // scrollbarX.series.push(series);
  //     // chart.scrollbarX = scrollbarX;

  //     // this.chart = chart;
  //   });
  // }

  // ngOnDestroy() {
  //   // Clean up chart when the component is removed
  //   this.browserOnly(() => {
  //     if (this.chart) {
  //       this.chart.dispose();
  //     }
  //   });
  // }
}
