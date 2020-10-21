import { AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { rejects } from 'assert';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-map-modal',
  templateUrl: './map-modal.component.html',
  styleUrls: ['./map-modal.component.scss'],
})
export class MapModalComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('map') mapElementRef: ElementRef;

  @Input() center = { lat: -34.611518, lng: -58.388967};
  @Input() selectable = true;
  @Input() title = 'Pick Location';

  clickListener: any;
  googleMaps: any;

  constructor(private modalCtrl: ModalController, private renderer: Renderer2) { }

  ngOnInit() {}

  ngOnDestroy() {
    if (this.selectable) {
      this.googleMaps.event.removeListener(this.clickListener);
    }
  }

  async ngAfterViewInit(){
    try {
      console.log(this.center, this.selectable, this.title);

      this.googleMaps = await this.getGoogleMaps();
      const mapEl = this.mapElementRef.nativeElement;
      const map = new this.googleMaps.Map(mapEl, {
        center: this.center,
        zoom: 16
      });

      this.googleMaps.event.addListenerOnce(map, 'idle', () => {
        this.renderer.addClass(mapEl, 'visible');
      });

      if (this.selectable) {
        this.clickListener = map.addListener('click', event => {
          const selectedCoords = {
            lat: event.latLng.lat(),
            lng: event.latLng.lng()
          };
          this.modalCtrl.dismiss(selectedCoords);
        });
      } else {
        const marker = new this.googleMaps.Marker({
          position: this.center,
          map,
          title: 'location'
        });
        marker.setMap(map);
      }

    } catch (error) {
      console.log('Error -> ', error);
    }
  }

  onCancel(){
    this.modalCtrl.dismiss();
  }

  private getGoogleMaps(): Promise<any> {
    const win = window as any;
    const googleModule = win.google;
    if (googleModule && googleModule.maps) {
      return Promise.resolve(googleModule.maps);
    }
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${environment.googleAPIKey}`;
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
      script.onload = () => {
        const loadedGoogleModule = win.google;
        if (loadedGoogleModule && loadedGoogleModule.maps) {
          resolve(loadedGoogleModule.maps);
        } else {
          reject('Google maps SDK not available.');
        }
      };
    });
  }
}
