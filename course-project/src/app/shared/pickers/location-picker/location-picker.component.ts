import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActionSheetController, AlertController, ModalController } from '@ionic/angular';
import { of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { Coordinates, PlaceLocation } from 'src/app/places/placeLocation.model';
import { environment } from 'src/environments/environment';
import { MapModalComponent } from '../../map-modal/map-modal.component';
import { Plugins, Capacitor } from '@capacitor/core';

@Component({
  selector: 'app-location-picker',
  templateUrl: './location-picker.component.html',
  styleUrls: ['./location-picker.component.scss'],
})
export class LocationPickerComponent implements OnInit {

  @Output() locationPicked = new EventEmitter<PlaceLocation>();
  @Input() showPreview = false;

  selectedLocationStaticImageUrl: string;
  isLoading = false;

  constructor(
    private modalCtrl: ModalController,
    private http: HttpClient,
    private actionSheetCtrl: ActionSheetController,
    private alertCtrl: AlertController
    ) { }

  ngOnInit() {}

  async onPickLocation(){
    const actionSheetEl = await this.actionSheetCtrl.create({
      header: 'Please choose',
      buttons: [
        {
          text: 'Auto-Locate',
          handler: () => {
            this.locateUser();
          }
        },
        {
          text: 'Pick on Map',
          handler: () => {
            this.openMap();
          }
        },
        {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    });
    await actionSheetEl.present();
  }

  private async locateUser() {
    if (!Capacitor.isPluginAvailable('Geolocation')) {
      this.showGeolocationError();
      return;
    }
    this.isLoading = true;
    try {
      const { coords: {latitude, longitude}  } = await Plugins.Geolocation.getCurrentPosition();
      this.createPlace({lat: latitude, lng: longitude});
      this.isLoading = false;
    } catch (error) {
      console.log('Geolocation Error -> ', error);
      this.isLoading = false;
      this.showGeolocationError();
    }
  }

  private async showGeolocationError(){
    const alertEl = await this.alertCtrl.create({
      header: 'Could not fetch location',
      message: 'Please use the map to pick a location.',
      buttons: ['Okay']
    });
    alertEl.present();
  }

  private async openMap() {
    const modalEl = await this.modalCtrl.create({
      component: MapModalComponent
    });
    modalEl.present();
    const { data } = await modalEl.onDidDismiss();
    if (!data){
      this.isLoading = false;
      return;
    }
    this.createPlace(data);
  }

  private createPlace(coords: Coordinates) {
    this.isLoading = true;
    const pickedLocation: PlaceLocation = {
      lat: coords.lat,
      lng: coords.lng,
      address: null,
      staticMapImageUrl: null
    };
    this.getAddress(coords.lat, coords.lng).pipe(
    switchMap(address => {
      pickedLocation.address = address;
      return of(this.getStaticMapImageUrl(coords.lat, coords.lng, 16));
    })
    ).subscribe(staticMapImageUrl => {
      pickedLocation.staticMapImageUrl = staticMapImageUrl;
      this.selectedLocationStaticImageUrl = staticMapImageUrl;
      this.locationPicked.emit(pickedLocation);
      this.isLoading = false;
    });
  }

  private getAddress(lat: number, lng: number){
    return this.http.get<any>(
    `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&location_type=ROOFTOP&result_type=street_address&key=${environment.googleAPIKey}`
    ).pipe(
      map(geoData => {
        if (!geoData || !geoData.results || geoData.results.length <= 0){
          return null;
        }
        return geoData.results[0].formatted_address;
      })
    );
  }

  private getStaticMapImageUrl(lat: number, lng: number, zoom: number){
    return `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=${zoom}&size=600x300&markers=color:red%7Clabel:PlaceS%7C${lat},${lng}&key=${environment.googleAPIKey}`;
  }
}
