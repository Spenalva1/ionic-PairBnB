import { Component, OnDestroy, OnInit } from '@angular/core';
import { AlertController, IonImg, IonItemSliding } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Booking } from './booking.model';
import { BookingService } from './booking.service';

@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.page.html',
  styleUrls: ['./bookings.page.scss'],
})
export class BookingsPage implements OnInit, OnDestroy {
  loadedBookings: Booking[];
  private bookingsSub: Subscription;

  constructor(private bookingService: BookingService, private alertCtrl: AlertController) { }

  ngOnInit() {
    this.bookingsSub = this.bookingService.bookings.subscribe(bookings => {
      this.loadedBookings = bookings;
    });
  }

  ngOnDestroy() {
    this.bookingsSub.unsubscribe();
  }

  async onCancel(bookingId: string, ionItemSliding: IonItemSliding){
    ionItemSliding.close();
    const alert = await this.alertCtrl.create({
      header: 'Cancel',
      message: 'Are you sure yout want to cancel it?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Continue',
          handler: () => {
            this.bookingService.cancelBookings(bookingId);
          }
        }
      ]
    });
    alert.present();
  }

}
