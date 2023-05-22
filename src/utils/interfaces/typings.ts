export interface IUserRegistration {
    username: string;
    first_name: string;
    last_name: string;
    avatar: string;
    email: string;
    password: string;
    repeat_password: string;
}

export interface User extends Omit<IUserRegistration, 'password' | 'repeat_password'> {
    token: string;
}

export enum PropertyType {
    HOUSE = 'House',
    HOTEL = 'Hotel',
    APARTMENT = 'Apartment',
}

export interface IPropertyRoom {
    id: string;
    name: string;
    capacity: number;
}

export interface IProperty {
    id: string;
    name: string;
    location: string;
    type: PropertyType;
    imageUrl: string;
    rating: number;
    rooms: IPropertyRoom[];
}
