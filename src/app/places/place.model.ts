import { PlaceLocation } from './placeLocation.model';

export class Place {
    constructor(
        public id: string,
        public title: string,
        public description: string,
        public location: PlaceLocation,
        public price: number,
        public imageUrl: string,
        public availableFrom: Date,
        public availableTo: Date,
        public userId: string
    ) {}
}