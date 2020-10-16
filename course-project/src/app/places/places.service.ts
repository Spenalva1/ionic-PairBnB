import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { take, map, tap } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';
import { Place } from './place.model';

@Injectable({
  providedIn: 'root'
})
export class PlacesService {
  private _places = new BehaviorSubject<Place[]>([
    new Place(
      'p1',
      'Manhattan Mansion',
      'In the heaet of New York City.',
      'https://www.ef.com.ar/sitecore/__/~/media/universal/pg/8x5/destination/US_US-NY_NYC_1.jpg',
      123.99,
      new Date(),
      new Date('2020-12-31'),
      'abc'
    ),
    new Place(
      'p2',
      'L\'Amour Toujours',
      'A romantic place in Paris.',
      'https://img.huffingtonpost.com/asset/5e1d9c4c2100003000af8d0c.jpeg?cache=5aaxY3NirQ&ops=scalefit_720_noupscale',
      499.99,
      new Date('2021-08-05'),
      new Date('2022-08-05'),
      'bcd'
    ),
    new Place(
      'p3',
      'Foggy Palace',
      'Not your average city trip!',
      'https://mapio.net/images-p/3326574.jpg',
      499.99,
      new Date(),
      new Date('2021-01-05'),
      'cde'
    ),
  ]);

  get places(){
    return this._places.asObservable();
  }

  constructor(private authService: AuthService) { }

  getPlaceById(placeId: string){
    return this.places.pipe(take(1), map(places => {
      return { ...places.find(place => place.id === placeId)}
    }));
  }

  addPlace(title: string, description: string, price: number, dateFrom: Date, dateTo: Date){
    const newPlace = new Place(Math.random().toString(), title, description, 'https://mapio.net/images-p/3326574.jpg', price, dateFrom, dateTo, this.authService.userId);
    this.places.pipe(take(1)).subscribe(places =>{
      this._places.next(places.concat(newPlace));
    })
  }

  updatePlace(placeId: string, title: string, description: string, price: number, dateFrom: Date, dateTo: Date){
    return this.places.pipe(take(1), tap(places => {
      const updatedPlaceIndex = places.findIndex(place => place.id === placeId)
      const updatedPlaces = [...places];
      updatedPlaces[updatedPlaceIndex].title = title;
      updatedPlaces[updatedPlaceIndex].description = description;
      updatedPlaces[updatedPlaceIndex].price = price;
      updatedPlaces[updatedPlaceIndex].availableFrom = dateFrom;
      updatedPlaces[updatedPlaceIndex].availableTo = dateTo;
      this._places.next(updatedPlaces);
    }));
  }

}
