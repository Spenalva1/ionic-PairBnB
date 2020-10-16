import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { PlacesService } from '../../places.service';

@Component({
  selector: 'app-new-offer',
  templateUrl: './new-offer.page.html',
  styleUrls: ['./new-offer.page.scss'],
})
export class NewOfferPage implements OnInit {
  form: FormGroup;
  currentDate: string

  constructor(private placesService: PlacesService, private router: Router, private loadingCtrl: LoadingController) { }

  ngOnInit() {
    this.currentDate = (new Date((new Date()).getTime() - 24*60*60)).toISOString();
    this.form = new FormGroup({
      title: new FormControl(null,{
        updateOn: 'blur',
        validators: [Validators.required],
      }),
      description: new FormControl(null,{
        updateOn: 'blur',
        validators: [Validators.required, Validators.maxLength(180)],
      }),
      price: new FormControl(null,{
        updateOn: 'blur',
        validators: [Validators.required, Validators.min(1)],
      }),
      dateFrom: new FormControl(this.currentDate,{
        updateOn: 'blur',
        validators: [Validators.required],
      }),
      dateTo: new FormControl(null,{
        updateOn: 'blur',
        validators: [Validators.required],
      }),
    });
  }

  async onCreateOffer(){
    if(this.form.invalid || !this.datesValid()) return;
    const loading = await this.loadingCtrl.create({
      message: 'Adding place...',
    });
    await loading.present();
    this.placesService.addPlace(
      this.form.value.title,
      this.form.value.description,
      +this.form.value.price,
      new Date(this.form.value.dateFrom),
      new Date(this.form.value.dateTo));
    this.form.reset();
    await loading.dismiss();
    this.router.navigate(['/places/tabs/offers']);
  }


  datesValid(){
    const startDate = new Date(this.form.value.dateFrom);
    const endDate = new Date(this.form.value.dateTo);
    return endDate > startDate;
  }
}
