import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Place } from '../../place.model';
import { PlacesService } from '../../places.service';

@Component({
  selector: 'app-edit-offer',
  templateUrl: './edit-offer.page.html',
  styleUrls: ['./edit-offer.page.scss'],
})
export class EditOfferPage implements OnInit {
  form: FormGroup;
  place: Place;

  constructor(private activatedRoute: ActivatedRoute, private navCtrl: NavController, private placesService: PlacesService) { }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(paramMap => {
      if(!paramMap.has('placeId')){
        this.navCtrl.navigateBack('/places/tabs/offers');
        return;
      }
      this.place = this.placesService.getPlaceById(paramMap.get('placeId'));
      this.form = new FormGroup({
        title: new FormControl(this.place.title,{
          updateOn: 'blur',
          validators: [Validators.required],
        }),
        description: new FormControl(this.place.description,{
          updateOn: 'blur',
          validators: [Validators.required, Validators.maxLength(180)],
        }),
        price: new FormControl(this.place.price,{
          updateOn: 'blur',
          validators: [Validators.required, Validators.min(1)],
        }),
        dateFrom: new FormControl(null,{
          updateOn: 'blur',
          validators: [Validators.required],
        }),
        dateTo: new FormControl(null,{
          updateOn: 'blur',
          validators: [Validators.required],
        }),
      });
    });
  }

  onUpdateOffer(){
    if(this.form.invalid) return;
  }

}
