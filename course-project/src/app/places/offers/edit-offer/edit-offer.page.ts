import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Place } from '../../place.model';
import { PlacesService } from '../../places.service';

@Component({
  selector: 'app-edit-offer',
  templateUrl: './edit-offer.page.html',
  styleUrls: ['./edit-offer.page.scss'],
})
export class EditOfferPage implements OnInit, OnDestroy {
  form: FormGroup;
  place: Place;
  private placeSub: Subscription;

  constructor(
    private activatedRoute: ActivatedRoute,
    private navCtrl: NavController,
    private placesService: PlacesService,
    private router: Router) { }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(paramMap => {
      if (!paramMap.has('placeId')){
        this.navCtrl.navigateBack('/places/tabs/offers');
        return;
      }

      this.placeSub = this.placesService.getPlaceById(paramMap.get('placeId')).subscribe(place => {
        this.place = place;
        this.form = new FormGroup({
          title: new FormControl(this.place.title, {
            updateOn: 'blur',
            validators: [Validators.required],
          }),
          description: new FormControl(this.place.description, {
            updateOn: 'blur',
            validators: [Validators.required, Validators.maxLength(180)],
          }),
          price: new FormControl(this.place.price, {
            updateOn: 'blur',
            validators: [Validators.required, Validators.min(1)],
          }),
          dateFrom: new FormControl(this.place.availableFrom.toISOString(), {
            updateOn: 'blur',
            validators: [Validators.required],
          }),
          dateTo: new FormControl(this.place.availableTo.toISOString(), {
            updateOn: 'blur',
            validators: [Validators.required],
          }),
        });
      })

    });
  }

  ngOnDestroy(){
    this.placeSub.unsubscribe();
  }

  onUpdateOffer(){
    this.placesService.updatePlace(this.place.id,
      this.form.value.title,
      this.form.value.description,
      this.form.value.price,
      this.form.value.dateFrom,
      this.form.value.dateTo)
    .subscribe(() => {
      this.form.reset();
      this.router.navigate(['places/tabs/offers']);
    });
  }

}
