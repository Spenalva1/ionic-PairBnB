import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, of } from 'rxjs';
import { take, map, tap, switchMap } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';
import { Place } from './place.model';
import { PlaceLocation } from './placeLocation.model';

interface PlaceData {
  availableFrom: string;
  availableTo: string;
  description: string;
  location: PlaceLocation;
  price: number;
  imageUrl: string;
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

  constructor(
    private authService: AuthService,
    private http: HttpClient) { }

  fetchPlaces() {
    return this.authService.token.pipe(
      take(1),
      switchMap(token => {
        return this.http.get<{ [key: string]: PlaceData }>(`https://ionic-course-project-741bb.firebaseio.com/offered-places.json?auth=${token}`);
      }),
      map(resData => {
        const places = [];
        for (const key in resData){
          if (resData.hasOwnProperty(key)){
            places.push(new Place(
              key,
              resData[key].title,
              resData[key].description,
              resData[key].location,
              resData[key].price,
              resData[key].imageUrl,
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
    return this.authService.token.pipe(
      take(1),
      switchMap(token => {
        return this.http.get<PlaceData>(`https://ionic-course-project-741bb.firebaseio.com/offered-places/${placeId}.json?auth=${token}`);
      }),
      map(placeData => {
        return new Place(
          placeId,
          placeData.title,
          placeData.description,
          placeData.location,
          placeData.price,
          placeData.imageUrl,
          new Date(placeData.availableFrom),
          new Date(placeData.availableTo),
          placeData.userId);
      })
    );
  }

  uploadImage(image: File) {
    const uploadData = new FormData();
    uploadData.append('image', image);

    return this.authService.token.pipe(
      take(1),
      switchMap(token => {
        return this.http.post<{imageUrl: string, imagePath: string}>(
          'https://us-central1-ionic-course-project-741bb.cloudfunctions.net/storeImage',
          uploadData,
          {
            headers: {
              Authorization: 'Bearer ' + token
            }
          }
        );
      })
    );
  }

  addPlace(title: string, description: string, location: PlaceLocation, imageUrl: string, price: number, dateFrom: Date, dateTo: Date){
    let generatedId: string;
    let fethcedUserId: string;
    let newPlace: Place;
    return this.authService.userId.pipe(
      take(1),
      switchMap(userId => {
        fethcedUserId = userId;
        return this.authService.token;
      }),
      take(1),
      switchMap(token => {
        if (!fethcedUserId){
          throw new Error('No user id found');
        }
        newPlace = new Place(
          null,
          title,
          description,
          location,
          price,
          imageUrl,
          dateFrom,
          dateTo,
          fethcedUserId
        );
        return this.http
          .post<{name: string}>(`https://ionic-course-project-741bb.firebaseio.com/offered-places.json?auth=${token}`, { ...newPlace });
      }),
      switchMap(resData => {
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
    let fetchedToken: string;
    return this.authService.token.pipe(
      take(1),
      switchMap(token => {
        fetchedToken = token;
        return this.places;
      }),
      take(1),
      switchMap(places => {
        if (!places || places.length <= 0){
          return this.fetchPlaces();
        } else{
          return of(places);
        }
      }),
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
