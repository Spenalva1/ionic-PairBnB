import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators'

@Injectable({ providedIn: 'root' })
export class PersonsService {
    personsChanged = new Subject<string[]>();
    persons: string[];

    constructor(private http: HttpClient) { }

    fetchPersons() {
        this.http.get<any>("https://swapi.dev/api/people/")
            .pipe(map(resData => {
                return resData.results.map(person => person.name);
            })).subscribe(transformedData => {
                this.personsChanged.next(transformedData);
            });
    }

    addPerson(person: string) {
        this.persons.push(person);
        this.personsChanged.next(this.persons);
    }

    removePerson(personToRemove: string) {
        this.persons = this.persons.filter(person => {
            return person !== personToRemove;
        });
        this.personsChanged.next(this.persons);
    }
}