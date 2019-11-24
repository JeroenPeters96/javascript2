import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {GoogleService} from '../../services/google.service';
import DirectionsRequest = google.maps.DirectionsRequest;


function animateCircle(line: google.maps.Polyline) {

   let count = 0;

   // tslint:disable-next-line:only-arrow-functions
   window.setInterval(function() {
     count = (count + 1) % 200;
     if(count === 199) {
       line.setVisible(false);
     }
     const icons = line.get('icons');
     icons[0].offset = (count / 2) + '%';
     line.set('icons', icons);

   }, 50);
 }

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit {
   title = 'javascript2';
   @ViewChild('gmap') gmapElement: any;
   map: google.maps.Map;
   @ViewChild('mapContainer') gmap: ElementRef;
   lat = 51;
   lng = 5.7;
   coordinates = new google.maps.LatLng(this.lat, this.lng);
   googleService: GoogleService;

   mapOptions: google.maps.MapOptions = {
     center: this.coordinates,
     zoom: 8,
   };

   marker = new google.maps.Marker({
     position: this.coordinates,
     map: this.map,
   });

   constructor(googleService: GoogleService) {
     this.googleService = googleService;
   }

   ngOnInit() {
   }

   ngAfterViewInit() {
     this.mapInitializer();
   }



   mapInitializer() {
     this.map = new google.maps.Map(this.gmap.nativeElement,
       this.mapOptions);
     // this.marker.setMap(this.map);

     const directionService = new google.maps.DirectionsService();
     const directionRenderer = new google.maps.DirectionsRenderer();

     directionRenderer.setMap(this.map);

     const request: DirectionsRequest = {
       origin: 'Weert',
         destination: 'Venray',
         travelMode: google.maps.TravelMode.DRIVING
     };



     function makeRouteCallback(directionRenderer: google.maps.DirectionsRenderer, map: google.maps.Map) {
       return function(p1: google.maps.DirectionsResult, p2: google.maps.DirectionsStatus) {
          if (p2 === 'OK') {
            const foundPath = [{
              lat:  p1.routes[0].legs[0].steps[0].path[0].lat(),
              lng: p1.routes[0].legs[0].steps[0].path[0].lng()
            }];
            p1.routes[0].legs[0].steps.forEach(data => {
              foundPath.push({lat: data.path[0].lat(),
              lng: data.path[0].lng()});
            }
            );
            console.log(foundPath);
            console.log( p1.routes[0].legs[0].steps[1].path[3].lat());
            const lineSymbol = {
              path: google.maps.SymbolPath.CIRCLE,
              scale: 8,
              strokeColor: '#393'
            };
            const line = new google.maps.Polyline({
              path: foundPath,
              icons: [{
                icon: lineSymbol,
                offset: '100%'
              }],
            });
            line.setMap(map);
            animateCircle(line);
          }
       };
     }

     directionService.route(request, makeRouteCallback(directionRenderer, this.map));
   }
}


