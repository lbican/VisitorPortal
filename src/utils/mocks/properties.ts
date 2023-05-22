import { IProperty, PropertyType } from '../interfaces/typings';

export const MOCK_PROPERTIES: IProperty[] = [
    {
        id: '90881b75-7552-47b6-8672-5379f93658ed',
        name: 'ZILIP Apartments',
        location: 'Vir',
        rating: 3,
        type: PropertyType.APARTMENT,
        imageUrl:
            'https://cf.bstatic.com/xdata/images/hotel/max1024x768/370901700.jpg?k=9e4e5128410b37a73eb7d6047ccc0d900d080fbee9023b9b104286f97021e5b8&o=&hp=1',
        rooms: [
            {
                name: 'One bedroom apartment',
                id: '973b80a6-661c-4a6b-99f6-3a0bd5ccf34c',
                capacity: 6,
            },
            {
                name: 'Two bedroom apartment',
                id: '973b80a6-661c-4a6b-99f6-3a0bd5ccf34c',
                capacity: 6,
            },
        ],
    },
    {
        id: '1a2b3c4d-5e6f-7g8h-9i0j-1k2l3m4n5o6p',
        name: 'Green Meadow House',
        location: 'Palo Alto',
        rating: 5,
        type: PropertyType.HOUSE,
        imageUrl:
            'https://photos.zillowstatic.com/fp/bb2c56474e1ff5fc422ee49579a5a035-cc_ft_960.jpg',
        rooms: [
            {
                name: 'Master bedroom',
                id: '2b3c4d5e-6f7g-8h9i-0j1k-2l3m4n5o6p7q',
                capacity: 2,
            },
            {
                name: 'Guest bedroom',
                id: '3c4d5e6f-7g8h-9i0j-1k2l-3m4n5o6p7q8r',
                capacity: 2,
            },
        ],
    },
    {
        id: '4d5e6f7g-8h9i-0j1k-2l3m-4n5o6p7q8r9s',
        name: 'Eagle View Apartments',
        location: 'Malibu',
        rating: 4,
        type: PropertyType.APARTMENT,
        imageUrl: 'https://images.pexels.com/photos/3315287/pexels-photo-3315287.jpeg',
        rooms: [
            {
                name: 'Studio apartment 1A',
                id: '5e6f7g8h-9i0j-1k2l-3m4n-5o6p7q8r9s0t',
                capacity: 2,
            },
        ],
    },
    {
        id: '6f7g8h9i-0j1k-2l3m-4n5o-6p7q8r9s0t1u',
        name: 'Starlight Hotel',
        location: 'Zadar',
        rating: 4,
        type: PropertyType.HOTEL,
        imageUrl: 'https://images.pexels.com/photos/2507011/pexels-photo-2507011.jpeg',
        rooms: [
            {
                name: 'Suite 101',
                id: '7g8h9i0j-1k2l-3m4n-5o6p-7q8r9s0t1u2v',
                capacity: 4,
            },
            {
                name: 'Double room 202',
                id: '8h9i0j1k-2l3m-4n5o-6p7q-8r9s0t1u2v3w',
                capacity: 2,
            },
        ],
    },
];
