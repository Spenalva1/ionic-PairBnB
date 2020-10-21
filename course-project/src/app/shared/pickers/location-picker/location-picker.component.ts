import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { PlaceLocation } from 'src/app/places/placeLocation.model';
import { environment } from 'src/environments/environment';
import { MapModalComponent } from '../../map-modal/map-modal.component';

@Component({
  selector: 'app-location-picker',
  templateUrl: './location-picker.component.html',
  styleUrls: ['./location-picker.component.scss'],
})
export class LocationPickerComponent implements OnInit {

  @Output() locationPick = new EventEmitter<PlaceLocation>();

  selectedLocationStaticImageUrl: string;
  isLoading = false;

  constructor(
    private modalCtrl: ModalController,
    private http: HttpClient
    ) { }

  ngOnInit() {}

  async onPickLocation(){
    const modalEl = await this.modalCtrl.create({
      component: MapModalComponent
    });
    modalEl.present();
    this.isLoading = true;
    const { data } = await modalEl.onDidDismiss();
    if (!data){
      this.isLoading = false;
      return;
    }
    const pickedLocation: PlaceLocation = {
      lat: data.lat,
      lng: data.lng,
      address: null,
      staticMapImageUrl: null
    };
    this.getAddress(data.lat, data.lng).pipe(
    switchMap(address => {
      pickedLocation.address = address;
      return of(this.getStaticMapImageUrl(data.lat, data.lng, 16));
    })
    ).subscribe(staticMapImageUrl => {
      pickedLocation.staticMapImageUrl = staticMapImageUrl;
      this.selectedLocationStaticImageUrl = staticMapImageUrl;
      this.locationPick.emit(pickedLocation);
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
