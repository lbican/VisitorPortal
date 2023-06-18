import { v4 as uuidv4 } from 'uuid';
import { IReservation } from '../interfaces/typings';

const mockData: IReservation[] = [
    {
        id: uuidv4(),
        guest: {
            id: uuidv4(),
            first_name: 'John',
            last_name: 'Doe',
            guests_num: 2,
        },
        unit: {
            id: uuidv4(),
            name: 'Unit 1A',
            capacity: 2,
        },
        is_booking_reservation: true,
        date_range: [new Date('2023-06-20'), new Date('2023-06-25')],
        total_price: 500,
        fulfilled: false,
        adv_payment_paid: true,
        created_at: new Date(),
        updated_at: null,
        note: 'Lorem ipsum dolor sit amet.',
    },
    {
        id: uuidv4(),
        guest: {
            id: uuidv4(),
            first_name: 'Jane',
            last_name: 'Smith',
            guests_num: 4,
        },
        unit: {
            id: uuidv4(),
            name: 'Unit 2B',
            capacity: 3,
        },
        is_booking_reservation: false,
        date_range: [new Date('2023-07-10'), new Date('2023-07-15')],
        total_price: 800,
        fulfilled: true,
        adv_payment_paid: true,
        created_at: new Date(),
        updated_at: new Date(),
        note: 'Dolor sit amet consectetur adipiscing elit.',
    },
    // Add more mock data as needed
];

export default mockData;
