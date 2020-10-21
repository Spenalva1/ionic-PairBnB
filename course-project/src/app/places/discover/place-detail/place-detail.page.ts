import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ActionSheetController, AlertController, ModalController, NavController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { BookingService } from 'src/app/bookings/booking.service';
import { CreateBookingComponent } from 'src/app/bookings/create-booking/create-booking.component';
import { MapModalComponent } from 'src/app/shared/map-modal/map-modal.component';
import { Place } from '../../place.model';
import { PlacesService } from '../../places.service';

@Component({
  selector: 'app-place-detail',
  templateUrl: './place-detail.page.html',
  styleUrls: ['./place-detail.page.scss'],
})
export class PlaceDetailPage implements OnInit, OnDestroy {
  place: Place;
  isBookable = false;
  isLoading = false;
  private placeSub: Subscription;

  constructor(private navCtrl: NavController,
              private activatedRoute: ActivatedRoute,
              private placesService: PlacesService,
              private modalCtrl: ModalController,
              private actionSheetCtrl: ActionSheetController,
              private bookingService: BookingService,
              private authService: AuthService,
              private alertCtrl: AlertController
  ) { }

  async ngOnInit() {
    this.isLoading = true;
    this.activatedRoute.paramMap.subscribe(paramMap => {
      if (!paramMap.has('placeId')){
        this.navCtrl.navigateBack('/places/tabs/discover');
        return;
      }
      this.placeSub = this.placesService.getPlaceById(paramMap.get('placeId')).subscribe(place => {
        this.place = place;
        this.isBookable = place.userId !== this.authService.userId;
        this.isLoading = false;
      }, error => {
        this.alertCtrl.create({
          message: 'Place not found!',
          buttons: [
            {
              text: 'okay',
              handler: () => {
                this.navCtrl.navigateBack('/places/tabs/discover');
              }
            }
          ]
        }).then(alert => {
          alert.present();
        });
      });
    });
  }

  ngOnDestroy(): void {
    this.placeSub.unsubscribe();
  }

  async onBookPlace(){
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Choose wisely...',
      buttons: [
        {
          text: 'Select date',
          handler: () => {this.openBookingModal('select'); }
        },
        {
          text: 'Random date',
          handler: () => {this.openBookingModal('random'); }
        },
        {
          text: 'Cancel',
          role: 'cancel'
        },
      ]
    });
    actionSheet.present();
  }

  openBookingModal(mode: 'select' | 'random'){
    this.modalCtrl
    .create({
      component: CreateBookingComponent,
      componentProps: {selectedPlace: this.place, selectedMode: mode}
    }).then(modalEl => {
      modalEl.present();
      return modalEl.onDidDismiss();
    }).then(resultData => {
      if (resultData.role === 'confirm'){
        this.bookingService.addBooking(
          this.place.id,
          this.place.title,
          this.place.imageUrl,
          resultData.data.bookingData.firstName,
          resultData.data.bookingData.lastName,
          resultData.data.bookingData.guestsNumber,
          resultData.data.bookingData.dateFrom,
          resultData.data.bookingData.dateTo,
        );
        this.navCtrl.navigateRoot('bookings');
      }
    });
  }

  async onShowMap() {
    const mapModal = await this.modalCtrl.create({
      component: MapModalComponent,
      componentProps: {
        center: { lat: this.place.location.lat, lng: this.place.location.lng},
        selectable: false,
        title: this.place.title
      }
    });
    mapModal.present();
  }
}
