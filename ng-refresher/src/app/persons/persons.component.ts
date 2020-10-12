import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { PersonsService } from './persons.service';

@Component({
    selector: 'app-persons',
    templateUrl: './persons.component.html',
    styleUrls: ['./persons.component.css'],
})

export class PersonsComponent implements OnInit, OnDestroy {
    private personsListSubscription: Subscription;
    isFetching = false;
    personsList: string[];

    constructor(private personsService: PersonsService) { }

    ngOnInit(): void {
        this.personsListSubscription = this.personsService.personsChanged.subscribe(persons => {
            this.personsList = persons;
            this.isFetching = false;
        });
        this.isFetching = true;
        this.personsService.fetchPersons();
    }

    onRemovePerson(person: string) {
        this.personsService.removePerson(person);
    }

    ngOnDestroy() {
        this.personsListSubscription.unsubscribe();
    }
}