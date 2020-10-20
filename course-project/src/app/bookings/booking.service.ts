import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { first, take } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';
import { Booking } from './booking.model';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private _bookings = new BehaviorSubject<Booking[]>([]);

  constructor( private authService: AuthService ) { }

  get bookings(){
    return this._bookings.asObservable();
  }

  addBooking(
    placeId: string,
    placeTitle: string,
    placeImage: string,
    firstName: string,
    lastName: string,
    guestsNumber: number,
    dateFrom: Date,
    dateTo: Date
  ){
    const newBooking = new Booking(
      Math.random().toString(),
      placeId,
      this.authService.userId,
      placeTitle,
      placeImage,
      firstName,
      lastName,
      guestsNumber,
      dateFrom,
      dateTo);
    this.bookings.pipe(take(1)).subscribe(bookings => {
      this._bookings.next(bookings.concat(newBooking));
    });
  }

  cancelBookings(bookingId: string){
    this.bookings.pipe(take(1)).subscribe(bookings => {
      this._bookings.next( bookings.filter(booking => booking.id !== bookingId ) );
    });
  }
}
