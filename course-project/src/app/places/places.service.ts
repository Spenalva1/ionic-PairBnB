import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { take, map, tap, switchMap } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';
import { Place } from './place.model';

interface PlaceData {
  availableFrom: string;
  availableTo: string;
  description: string;
  imageUrl: string;
  price: number;
  title: string;
  userId: string;
}


// new Place(
//   'p1',
//   'Manhattan Mansion',
//   'In the heaet of New York City.',
//   'https://www.ef.com.ar/sitecore/__/~/media/universal/pg/8x5/destination/US_US-NY_NYC_1.jpg',
//   123.99,
//   new Date(),
//   new Date('2020-12-31'),
//   'abc'
// ),
// new Place(
//   'p2',
//   'L\'Amour Toujours',
//   'A romantic place in Paris.',
//   'https://img.huffingtonpost.com/asset/5e1d9c4c2100003000af8d0c.jpeg?cache=5aaxY3NirQ&ops=scalefit_720_noupscale',
//   499.99,
//   new Date('2021-08-05'),
//   new Date('2022-08-05'),
//   'bcd'
// ),
// new Place(
//   'p3',
//   'Foggy Palace',
//   'Not your average city trip!',
//   'https://mapio.net/images-p/3326574.jpg',
//   499.99,
//   new Date(),
//   new Date('2021-01-05'),
//   'cde'
// ),


@Injectable({
  providedIn: 'root'
})
export class PlacesService {
  private _places = new BehaviorSubject<Place[]>([]);

  get places(){
    return this._places.asObservable();
  }

  constructor(private authService: AuthService, private http: HttpClient) { }

  fetchPlaces() {
    return this.http.get<{ [key: string]: PlaceData }>('https://ionic-course-project-741bb.firebaseio.com/offered-places.json')
    .pipe(
      map(resData => {
        const places = [];
        for (const key in resData){
          if (resData.hasOwnProperty(key)){
            places.push(new Place(
              key,
              resData[key].title,
              resData[key].title,
              resData[key].imageUrl,
              resData[key].price,
              new Date(resData[key].availableFrom),
              new Date(resData[key].availableTo),
              resData[key].userId));
          }
        }
        return places;
      }),
      tap(places => {
        this._places.next(places);
      })
    );
  }

  getPlaceById(placeId: string){
    return this.places.pipe(take(1), map(places => {
      return { ...places.find(place => place.id === placeId) };
    }));
  }

  addPlace(title: string, description: string, price: number, dateFrom: Date, dateTo: Date){
    let generatedId: string;
    const newPlace = new Place(
      null,
      title, description,
      'https://mapio.net/images-p/3326574.jpg',
      price,
      dateFrom,
      dateTo,
      this.authService.userId);
    return this.http
      .post<{name: string}>('https://ionic-course-project-741bb.firebaseio.com/offered-places.json', { ...newPlace })
      .pipe(switchMap(resData => {
        generatedId = resData.name;
        return this.places;
      }),
      take(1))
      .subscribe( places => {
        newPlace.id = generatedId;
        this._places.next(places.concat(newPlace));
      });
  }

  updatePlace(placeId: string, title: string, description: string, price: number, dateFrom: Date, dateTo: Date){
    let updatedPlaces = [];
    return this.places.pipe(
      take(1),
      switchMap(places => {
          const updatedPlaceIndex = places.findIndex(place => place.id === placeId);
          updatedPlaces = [...places];
          updatedPlaces[updatedPlaceIndex].title = title;
          updatedPlaces[updatedPlaceIndex].description = description;
          updatedPlaces[updatedPlaceIndex].price = price;
          updatedPlaces[updatedPlaceIndex].availableFrom = dateFrom;
          updatedPlaces[updatedPlaceIndex].availableTo = dateTo;
          return this.http.put(`https://ionic-course-project-741bb.firebaseio.com/offered-places/${placeId}.json/`,
            { ...updatedPlaces[updatedPlaceIndex] , id: null});
      }),
      tap(() => {
          this._places.next(updatedPlaces);
      })
    );
  }

}
