import {
    IFormReservation,
    IGuest,
    IReservation,
} from '../../../utils/interfaces/typings';

const getReservationFormValues = (
    unitId: string,
    date_range: [Date, Date],
    editingReservation?: IReservation
): IFormReservation & IGuest => {
    const defaultReservation: IFormReservation & IGuest = {
        id: '',
        guest_id: '',
        unit_id: unitId,
        is_booking_reservation: false,
        date_range: [date_range[0] || new Date(), date_range[1] || new Date()],
        total_price: 0,
        note: '',
        first_name: '',
        last_name: '',
        guests_num: 1,
    };

    if (editingReservation) {
        defaultReservation.guest_id = editingReservation.guest.id; // assuming the guest id is accessed this way
        defaultReservation.unit_id = editingReservation.unit.id;
        defaultReservation.date_range = [
            editingReservation.date_range[0] || new Date(),
            editingReservation.date_range[1] || new Date(),
        ];
        defaultReservation.total_price = editingReservation.total_price;
        defaultReservation.note = editingReservation.note;
        defaultReservation.first_name = editingReservation.guest.first_name;
        defaultReservation.last_name = editingReservation.guest.last_name;
        defaultReservation.guests_num = editingReservation.guest.guests_num;
    }

    return defaultReservation;
};

export default getReservationFormValues;
