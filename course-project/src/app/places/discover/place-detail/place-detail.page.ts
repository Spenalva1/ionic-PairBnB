import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ActionSheetController, ModalController, NavController } from '@ionic/angular';
import { CreateBookingComponent } from 'src/app/bookings/create-booking/create-booking.component';
import { Place } from '../../place.model';
import { PlacesService } from '../../places.service';

@Component({
  selector: 'app-place-detail',
  templateUrl: './place-detail.page.html',
  styleUrls: ['./place-detail.page.scss'],
})
export class PlaceDetailPage implements OnInit {
  place: Place;

  constructor(private navCtrl: NavController,
    private activatedRoute: ActivatedRoute,
    private placesService: PlacesService,
    private modalCtrl: ModalController,
    private actionSheetCtrl: ActionSheetController
  ) { }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(paramMap => {
      if(!paramMap.has('placeId')){
        this.navCtrl.navigateBack('/places/tabs/discover');
        return;
      }
      this.place = this.placesService.getPlaceById(paramMap.get('placeId'));
    })
  }

 async onBookPlace(){
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Choose wisely...',
      buttons: [
        {
          text: 'Select date',
          handler: () => {this.openBookingModal('select')}
        },
        {
          text: 'Random date',
          handler: () => {this.openBookingModal('random')}
        },
        {
          text: 'Cancel',
          role: 'cancel'
        },
      ]
    });
    await actionSheet.present();
  }

  openBookingModal(mode: 'select' | 'random'){
    this.modalCtrl
      .create({
        component: CreateBookingComponent,
        componentProps: {selectedPlace: this.place, selectedMode: mode}
      }).then(modalEl =>{
        modalEl.present();
        return modalEl.onDidDismiss();
      }).then(resultData => {
        console.log(resultData.data.bookingData, resultData.role);

      });
  }
}
