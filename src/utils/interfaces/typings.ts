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
    APARTMENT = 'Apartments',
}

export interface IUnit {
    id: string;
    name: string;
    capacity: number;
}

export interface IProperty {
    id: string;
    name: string;
    location?: string;
    type: PropertyType;
    image_path: string;
    rating?: number;
    description?: string;
    units: IUnit[];
}

export type TFormProperty = Omit<IProperty, 'id'>;
