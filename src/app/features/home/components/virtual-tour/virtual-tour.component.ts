import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { panoramas } from 'src/app/core/constants/faculties-geo-location.constant';
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

  public selectedFaculty = 'fcim';

  public availableFaculties = Object.keys(panoramas);

  constructor(
    private router: Router,
  ) { 
    const facultyCode = this.router?.getCurrentNavigation()?.extras?.state?.facultyCode;

    if (facultyCode && this.availableFaculties.includes(facultyCode)) {
      this.selectedFaculty = facultyCode;
    }

    new google.maps.StreetViewService()
    .getPanorama({ location: { lat: 47.061621, lng: 28.867827 }}, (data) => {
      this.initPanorama(this.selectedFaculty);
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
        tileSize: new google.maps.Size(5120, 2560),
        worldSize: new google.maps.Size(5120, 2560),
        centerHeading: panorama.centerHeading || 0,
        getTileUrl: () => panorama.imagePath,
      },
    };
  }
  
  public initPanorama(facultyCode: string): void {
    this.panorama = new google.maps.StreetViewPanorama(
      document.getElementById('street-view') as HTMLElement,
      { pano: `${facultyCode}_first`, visible: true }
    );

    this.panorama.registerPanoProvider(() => {
      return this.getAdditionalPanorama(panoramas[facultyCode][0]);
    });
  
    this.panorama.addListener('pano_changed', () => {
      const newPano = panoramas[facultyCode].find((p) => p.pano === this.panorama.getPano())
      
      if (newPano) {
        this.panorama.registerPanoProvider(() => {
          return this.getAdditionalPanorama(newPano);
        });
      }
    })

    this.panorama.addListener('links_changed', () => {
      const currentPano = panoramas[facultyCode].find((p) => p.pano === this.panorama.getPano())

      if (!!currentPano) {
        this.panorama.getLinks().push(...currentPano.links);
      }
    });
  }

  public navigateBack() {
    this.router.navigateByUrl('/');
  }

  public onFacultyChange(event) {
    this.selectedFaculty = event.value;

    this.initPanorama(this.selectedFaculty);
  }
}
