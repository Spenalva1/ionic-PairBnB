import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ActionSheetController, ModalController, NavController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { BookingService } from 'src/app/bookings/booking.service';
import { CreateBookingComponent } from 'src/app/bookings/create-booking/create-booking.component';
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
  private placeSub: Subscription;

  constructor(private navCtrl: NavController,
              private activatedRoute: ActivatedRoute,
              private placesService: PlacesService,
              private modalCtrl: ModalController,
              private actionSheetCtrl: ActionSheetController,
              private bookingService: BookingService,
              private authService: AuthService,
  ) { }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(paramMap => {
      if (!paramMap.has('placeId')){
        this.navCtrl.navigateBack('/places/tabs/discover');
        return;
      }
      this.placeSub = this.placesService.getPlaceById(paramMap.get('placeId')).subscribe(place => {
        this.place = place;
        this.isBookable = place.userId !== this.authService.userId;
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
}
