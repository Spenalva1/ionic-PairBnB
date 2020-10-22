import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { switchMap } from 'rxjs/operators';
import { PlaceLocation } from '../../placeLocation.model';
import { PlacesService } from '../../places.service';

function base64toBlob(base64Data, contentType) {
  contentType = contentType || '';
  const sliceSize = 1024;
  const byteCharacters = atob(base64Data);
  const bytesLength = byteCharacters.length;
  const slicesCount = Math.ceil(bytesLength / sliceSize);
  const byteArrays = new Array(slicesCount);

  for (let sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
    const begin = sliceIndex * sliceSize;
    const end = Math.min(begin + sliceSize, bytesLength);

    const bytes = new Array(end - begin);
    for (let offset = begin, i = 0; offset < end; ++i, ++offset) {
      bytes[i] = byteCharacters[offset].charCodeAt(0);
    }
    byteArrays[sliceIndex] = new Uint8Array(bytes);
  }
  return new Blob(byteArrays, { type: contentType });
}


@Component({
  selector: 'app-new-offer',
  templateUrl: './new-offer.page.html',
  styleUrls: ['./new-offer.page.scss'],
})
export class NewOfferPage implements OnInit {
  form: FormGroup;
  currentDate: string;

  constructor(private placesService: PlacesService, private router: Router, private loadingCtrl: LoadingController) { }

  ngOnInit() {
    this.currentDate = (new Date((new Date()).getTime() - 24 * 60 * 60)).toISOString();
    this.form = new FormGroup({
      title: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required],
      }),
      description: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.maxLength(180)],
      }),
      price: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.min(1)],
      }),
      dateFrom: new FormControl(this.currentDate, {
        updateOn: 'blur',
        validators: [Validators.required],
      }),
      dateTo: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required],
      }),
      location: new FormControl(null, {
        validators: [Validators.required],
      }),
      image: new FormControl(null),
    });
  }

  async onCreateOffer(){
    if (this.form.invalid || !this.datesValid() || !this.form.get('image').value) {
      return;
    }
    const loading = await this.loadingCtrl.create({
      message: 'Adding place...',
    });
    loading.present();
    this.placesService.uploadImage(this.form.get('image').value).subscribe((uploadRes) => {
      this.placesService.addPlace(
        this.form.value.title,
        this.form.value.description,
        this.form.value.location,
        uploadRes.imageUrl,
        +this.form.value.price,
        new Date(this.form.value.dateFrom),
        new Date(this.form.value.dateTo)
      );
      this.form.reset();
      loading.dismiss();
      this.router.navigate(['/places/tabs/offers']);
    });
  }

  onLocationPicked(placeLocation: PlaceLocation) {
    this.form.patchValue({
      location: placeLocation
    });
  }

  onImagePicked(imageData: string | File) {
    let imageFile: any;
    if (typeof imageData === 'string') {
      try {
        imageFile = base64toBlob(imageData, 'image/jpeg');
      } catch (error) {
        console.log('Error -> ', error);
        return;
      }
    } else {
      imageFile = imageData;
    }
    this.form.patchValue({ image : imageFile });
  }

  datesValid(){
    const startDate = new Date(this.form.value.dateFrom);
    const endDate = new Date(this.form.value.dateTo);
    return endDate > startDate;
  }
}
