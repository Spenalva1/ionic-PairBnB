import { getAttrsForDirectiveMatching } from '@angular/compiler/src/render3/view/util';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { start } from 'repl';
import { Place } from 'src/app/places/place.model';

@Component({
  selector: 'app-create-booking',
  templateUrl: './create-booking.component.html',
  styleUrls: ['./create-booking.component.scss'],
})
export class CreateBookingComponent implements OnInit {
  @Input() selectedPlace: Place;
  @Input() selectedMode: string;
  @ViewChild('f', {static: true}) form: NgForm;
  startDate: string;
  endDate: string;

  constructor(private modalCtrl: ModalController) { }

  ngOnInit() {
    const availableFrom = new Date(this.selectedPlace.availableFrom);
    const availableTo = new Date(this.selectedPlace.availableTo);
    if(this.selectedMode === 'random'){
      this.startDate = new Date(availableFrom.getTime() + Math.random() * (availableTo.getTime() - 7*24*60*60*1000 - availableFrom.getTime())).toISOString();
      this.endDate = new Date(new Date(this.startDate).getTime() + Math.random() * 6*24*60*60*1000).toISOString();
    }
  }

  onCancel(){
    this.modalCtrl.dismiss(null, 'cancel');
  }

  onBookPlace(){
    if(this.form.invalid || !this.datesValid()) return;
    this.modalCtrl.dismiss({bookingData: {
      firstName: this.form.value['firstName'],
      lastName: this.form.value['lastName'],
      guestsNumber: this.form.value['guestsNumber'],
      dateFrom: this.form.value['dateFrom'],
      dateTo: this.form.value['dateTo'],
    }}, 'confirm')
  }

  datesValid(){
    const startDate = new Date(this.form.value['dateFrom']);
    const endDate = new Date(this.form.value['dateTo']);
    return endDate > startDate;
  }
}
