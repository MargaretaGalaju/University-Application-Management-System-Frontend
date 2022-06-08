import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { fcim } from 'src/app/core/constants/faculties-geo-location.constant';
import { EngineService } from 'src/app/core/services/3d-map/engine.service';
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
  providers: [EngineService],
})
export class VirtualTourComponent {
  @ViewChild('rendererCanvas', {static: true})
  public rendererCanvas: ElementRef<HTMLCanvasElement>;

  public activeFaculty: Faculty;
  
  public panorama: google.maps.StreetViewPanorama;

  constructor(
    private router: Router,
  ) {
    new google.maps.StreetViewService()
    .getPanorama({ location: { lat: 47.061621, lng: 28.867827 }}, (data) => {
      this.initPanorama();
    });
   }

  public getAdditionalPanorama(panorama): google.maps.StreetViewPanoramaData {
    return {
      location: {
        pano: panorama.pano,
        description: panorama.description,
        latLng: new google.maps.LatLng(panorama.position.lat, panorama.position.long),
      },
      links: panorama.links,
      copyright: 'Unipply (c)',
      tiles: {
        tileSize: new google.maps.Size(6912, 3456),
        worldSize: new google.maps.Size(6912, 3456),
        centerHeading: 105,
        getTileUrl: () => panorama.imagePath,
      },
    };
  }
  
  public initPanorama(): void {
    this.panorama = new google.maps.StreetViewPanorama(
      document.getElementById('street-view') as HTMLElement,
      { pano: 'first', visible: true }
    );

    this.panorama.registerPanoProvider(() => {
      return this.getAdditionalPanorama(fcim.additionalPanoramas[0]);
    });
  
    this.panorama.addListener('pano_changed', () => {
      const newPano = fcim.additionalPanoramas.find((p) => p.pano === this.panorama.getPano())
      
      if (newPano) {
        this.panorama.registerPanoProvider(() => {
          return this.getAdditionalPanorama(newPano);
        });
      }
    })

    this.panorama.addListener('links_changed', () => {
      const currentPano = fcim.additionalPanoramas.find((p) => p.pano === this.panorama.getPano())

      if (!!currentPano) {
        this.panorama.getLinks().push(...currentPano.links);
      }
    });
  }

  public navigateBack() {
    this.router.navigateByUrl('/');
  }
}
