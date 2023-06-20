import { UserProfile } from '../../context/auth-context';

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

export enum ManagerType {
    OWNER = 'OWNER',
    MANAGER = 'MANAGER',
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
    manager_type: ManagerType;
}

export interface PropertyManager extends UserProfile {
    manager_type: ManagerType;
}

export type TFormProperty = Omit<IProperty, 'id'>;
export type Status = 'idle' | 'loading' | 'succeeded' | 'failed';

export interface IReservation {
    id: string;
    guest: IGuest;
    unit: IUnit;
    is_booking_reservation: boolean;
    date_range: [Date, Date];
    total_price: number;
    fulfilled: boolean;
    adv_payment_paid: boolean;
    created_at: Date;
    updated_at: Date | null;
    note: string;
}

export interface IFormReservation {
    guest_id: string;
    unit_id: string;
    is_booking_reservation: boolean;
    date_range: [Date, Date];
    total_price: number;
    note: string;
}

export interface IGuest {
    id: string;
    first_name: string;
    last_name: string;
    guests_num: number;
}
