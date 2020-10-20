import { Component, OnDestroy, OnInit } from '@angular/core';
import { SegmentChangeEventDetail } from '@ionic/core';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { Place } from '../place.model';
import { PlacesService } from '../places.service';

@Component({
  selector: 'app-discover',
  templateUrl: './discover.page.html',
  styleUrls: ['./discover.page.scss'],
})
export class DiscoverPage implements OnInit, OnDestroy {
  loadedPlaces: Place[];
  relevantPlaces: Place[];
  private placesSub: Subscription;
  private filter = 'all';

  constructor(private placesService: PlacesService, private authService: AuthService) { }

  ngOnInit() {
    this.placesSub = this.placesService.places.subscribe(places => {
      this.loadedPlaces = places;
      this.onFilterUpdate(this.filter);
    });
  }

  ngOnDestroy(): void {
    this.placesSub.unsubscribe();
  }

  onFilterUpdate(event: string){
    if (event === 'all'){
      this.relevantPlaces = this.loadedPlaces;
    }
    if (event === 'bookable'){
      this.relevantPlaces = this.loadedPlaces.filter(place => place.userId !== this.authService.userId)
    }
  }
}
