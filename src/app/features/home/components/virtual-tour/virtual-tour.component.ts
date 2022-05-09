import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { fcim } from 'src/app/core/constants/faculties-geo-location.constant';
import { EngineService } from 'src/app/core/services/3d-map/engine.service';
import { FacultyApiService } from 'src/app/core/services/faculty-api.service';
import { Faculty } from 'src/app/shared/models/faculty.model';

declare var google: any;

declare global {
  interface Window {
    initMap: () => void;
    google: typeof google;
  }
}

@Component({
  selector: 'app-virtual-tour',
  templateUrl: './virtual-tour.component.html',
  styleUrls: ['./virtual-tour.component.scss'],
  providers: [EngineService]
})
export class VirtualTourComponent {
  @ViewChild('rendererCanvas', {static: true})
  public rendererCanvas: ElementRef<HTMLCanvasElement>;

  public activeFaculty: Faculty;
  
  public panorama: google.maps.StreetViewPanorama;

  public outsideGoogle: google.maps.StreetViewPanoramaData;
  
  constructor() {
    window.initMap = new google.maps.StreetViewService()
      .getPanorama({ location: { lat: 47.061621, lng: 28.867827 }}, (data) => {
        this.outsideGoogle = data;
        this.initPanorama();
      });
   }

  public getFacultyPanoramaData(panorama): google.maps.StreetViewPanoramaData {
    return {
      location: {
        pano: panorama.pano,
        description: panorama.description,
        latLng: new google.maps.LatLng(panorama.position.lat, panorama.position.long),
      },
      links: [
        {
          heading: 195,
          description: "Exit",
          pano: (this.outsideGoogle.location as google.maps.StreetViewLocation).pano,
        },
        // {
        //   heading: 25,
        //   description: "Go further",
        //   pano: (this.outsideGoogle.location as google.maps.StreetViewLocation).pano,
        // },
      ],
      copyright: "Unipply (c)",
      tiles: {
        tileSize: new google.maps.Size(6912, 3456),
        worldSize: new google.maps.Size(6912, 3456),
        centerHeading: 105,
        getTileUrl: function (
          pano: string,
          zoom: number,
          tileX: number,
          tileY: number
        ): string {
          console.log('here');
          
          return panorama.imagePath
        },
      },
    };
  }
  
  public initPanorama() {
    this.panorama = new google.maps.StreetViewPanorama(
      document.getElementById("street-view") as HTMLElement,
      { pano: (this.outsideGoogle.location as google.maps.StreetViewLocation).pano }
    );

    this.panorama.registerPanoProvider(
      (pano: string): google.maps.StreetViewPanoramaData => {
        if (pano === "fcim") {
          return this.getFacultyPanoramaData(fcim.additionalPanoramas[0]);
        }
        return null;
      }
    );
  
    this.panorama.addListener("links_changed", () => {
      if (
        this.panorama.getPano() ===
        (this.outsideGoogle.location as google.maps.StreetViewLocation).pano
      ) {
        this.panorama.getLinks().push({
          description: "FCIM",
          heading: 25,
          pano: "fcim",
        });
      }
    });
  }
}
