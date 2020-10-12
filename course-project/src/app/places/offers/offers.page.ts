import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonItemSliding } from '@ionic/angular';
import { Place } from '../place.model';
import { PlacesService } from '../places.service';

@Component({
  selector: 'app-offers',
  templateUrl: './offers.page.html',
  styleUrls: ['./offers.page.scss'],
})
export class OffersPage implements OnInit {
  loadedOffers: Place[];

  constructor(private placesService: PlacesService, private router: Router) { }

  ngOnInit() {
    this.loadedOffers = this.placesService.places;
  }

  onEdit(offerId: string, ionItemSliding: IonItemSliding){
    ionItemSliding.close();
    this.router.navigateByUrl('/places/tabs/offers/edit/' + offerId);
  }
}
