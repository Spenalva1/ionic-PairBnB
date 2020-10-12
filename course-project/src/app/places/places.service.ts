import { Injectable } from '@angular/core';
import { Place } from './place.model';

@Injectable({
  providedIn: 'root'
})
export class PlacesService {
  private _places: Place[] = [
    new Place(
      'p1',
      'Manhattan Mansion',
      'In the heaet of New York City.',
      'https://www.ef.com.ar/sitecore/__/~/media/universal/pg/8x5/destination/US_US-NY_NYC_1.jpg',
      123.99,
      new Date(),
      new Date('2020-12-31'),
    ),
    new Place(
      'p2',
      'L\'Amour Toujours',
      'A romantic place in Paris.',
      'https://img.huffingtonpost.com/asset/5e1d9c4c2100003000af8d0c.jpeg?cache=5aaxY3NirQ&ops=scalefit_720_noupscale',
      499.99,
      new Date('2021-08-05'),
      new Date('2022-08-05'),
    ),
    new Place(
      'p3',
      'Foggy Palace',
      'Not your average city trip!',
      'https://mapio.net/images-p/3326574.jpg',
      499.99,
      new Date(),
      new Date('2021-01-05'),
    ),
  ];

  get places(){
    return [...this._places];
  }

  constructor() { }

  getPlaceById(placeId: string){
    return {...this.places.find(place => place.id === placeId)};
  }

}
