import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertController, NavController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Place } from '../../place.model';
import { PlacesService } from '../../places.service';

@Component({
  selector: 'app-offer-bookings',
  templateUrl: './offer-bookings.page.html',
  styleUrls: ['./offer-bookings.page.scss'],
})
export class OfferBookingsPage implements OnInit, OnDestroy {
  place: Place;
  private placeSub: Subscription;
  isLoading = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private navCtrl: NavController,
    private placesService: PlacesService,
    private alertCtrl: AlertController
    ) { }

  ngOnInit() {
    this.isLoading = true;
    this.activatedRoute.paramMap.subscribe(paramMap => {
      if (!paramMap.has('placeId')){
        this.navCtrl.navigateBack('/places/tabs/offers');
        return;
      }
      this.placeSub = this.placesService.getPlaceById(paramMap.get('placeId')).subscribe(place => {
        this.place = place;
        this.isLoading = false;
      }, error => {
        this.alertCtrl.create({
          message: 'Offer not found!',
          buttons: [
            {
              text: 'okay',
              handler: () => {
                this.navCtrl.navigateBack('/places/tabs/offers');
              }
            }
          ]
        }).then(alert => {
          alert.present();
        });
      });
    });
  }

  ngOnDestroy(){
    this.placeSub.unsubscribe();
  }

}
