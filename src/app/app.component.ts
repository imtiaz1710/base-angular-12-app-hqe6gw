import { Component, NgZone, AfterViewInit } from '@angular/core';

import * as am4core from '@amcharts/amcharts4/core';
import * as am4maps from '@amcharts/amcharts4/maps';
import am4geodata_worldHigh from '@amcharts/amcharts4-geodata/worldHigh';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements AfterViewInit {
  constructor(private zone: NgZone) {

  }

    ngAfterViewInit() {
    
/* Create map instance */
var chart = am4core.create('chartdiv', am4maps.MapChart);

/* Set map definition */
chart.geodata = am4geodata_worldLow;

/* Set projection */
chart.projection = new am4maps.projections.Miller();

/* Create map polygon series */
var polygonSeries = chart.series.push(new am4maps.MapPolygonSeries());

/* Make map load polygon (like country names) data from GeoJSON */
polygonSeries.useGeodata = true;

/* Configure series */
var polygonTemplate = polygonSeries.mapPolygons.template;
polygonTemplate.tooltipText = '{name}';
polygonTemplate.fill = am4core.color('#74B266');
polygonTemplate.events.on('hit', function(ev) {
  ev.target.series.chart.zoomToMapObject(ev.target);
});

/* Create hover state and set alternative fill color */
var hs = polygonTemplate.states.create('hover');
hs.properties.fill = am4core.color('#367B25');

// No thanks, Antarctica, no thanks.
polygonSeries.exclude = ['AQ'];

chart.zoomControl = new am4maps.ZoomControl();

var buttonTopPosition;

polygonSeries.events.on('inited', () => {
  polygonSeries.mapPolygons.each(polygon => {
    const id = polygon.dataItem.dataContext.id;
    let assignButton;

    switch (id) {
      case 'US':
        assignButton = 'us';
        break;

      case 'BR':
        assignButton = 'br';
        break;

      default:
        break;
    }

    if (assignButton) {
      const button = document.getElementById(`${assignButton}-button`);
      button.addEventListener('click', () => {
        chart = createMarkers(chart);
        setTimeout(() => {
          const animation = chart.zoomToMapObject(polygon);
          animation.events.on('animationended', () => {
            chart.homeGeoPoint = chart.centerGeoPoint;
            chart.homeZoomLevel = chart.zoomLevel;
          });
        }, 500);
      });
    }
  });
});
    
    }
}

function createMarkers(chart) {
  console.log('calling createMarkers');
  const demoAddress = { my_lat: 35.6895, my_lng: 139.6917 };
  const mapImageSeries = chart.series.push(new am4maps.MapImageSeries());

  const imageSeriesTemplate = mapImageSeries.mapImages.template;
  const circle = imageSeriesTemplate.createChild(am4core.Circle);
  circle.radius = 10;
  circle.fill = am4core.color('#ff0000');
  circle.stroke = am4core.color('#FFFFFF');
  circle.strokeWidth = 2;
  circle.nonScaling = true;
  circle.tooltipText = 'hi';
  imageSeriesTemplate.propertyFields.latitude = 'latitude';
  imageSeriesTemplate.propertyFields.longitude = 'longitude';
  mapImageSeries.data = { latitude: demoAddress.latitude, longitude: demoAddress.longitude };
  return chart;
}


