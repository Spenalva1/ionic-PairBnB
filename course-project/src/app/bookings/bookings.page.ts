import { Component, OnDestroy, OnInit } from '@angular/core';
import { AlertController, IonImg, IonItemSliding } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { switchMap, take } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';
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
  isLoading = false;

  constructor(
    private bookingService: BookingService,
    private alertCtrl: AlertController,
    private authService: AuthService,
    ) { }

  ngOnInit() {
    this.authService.userId.pipe(
      take(1)
    ).subscribe(userId => {
      this.bookingsSub = this.bookingService.bookings.subscribe(bookings => {
        this.loadedBookings = bookings.filter(booking => userId);
      });
    });
  }

  ionViewWillEnter() {
    this.isLoading = true;
    this.bookingService.fetchBookings().subscribe(() => {
      this.isLoading = false;
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
