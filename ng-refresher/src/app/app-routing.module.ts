import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PersonInputComponent } from './persons/person-input.component';
import { PersonsComponent } from './persons/persons.component';

const routes: Routes = [
    { path: '', component: PersonsComponent },
    { path: 'create', component: PersonInputComponent },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})

export class AppRoutingModule { }