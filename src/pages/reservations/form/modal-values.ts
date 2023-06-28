import {
    IFormReservation,
    IGuest,
    IReservation,
    ReservationType,
} from '../../../utils/interfaces/typings';

const getReservationFormValues = (
    unitId: string,
    date_range: [Date, Date],
    editingReservation?: IReservation
): IFormReservation & Partial<IGuest> => {
    const defaultReservation: IFormReservation & Partial<IGuest> = {
        id: '',
        guest_id: '',
        unit_id: unitId,
        date_range: [date_range[0] || new Date(), date_range[1] || new Date()],
        total_price: 0,
        note: '',
        first_name: '',
        last_name: '',
        guests_num: 1,
        prepayment_percent: 0,
        prepayment_paid: false,
        type: ReservationType.CUSTOM,
    };

    if (editingReservation) {
        defaultReservation.id = editingReservation.id;
        defaultReservation.guest_id = editingReservation.guest.id;
        defaultReservation.guest_id = editingReservation.guest.id;
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
        defaultReservation.prepayment_paid = editingReservation.prepayment_paid;
        defaultReservation.prepayment_percent = editingReservation.prepayment_percent;
        defaultReservation.country = editingReservation.guest.country;
        defaultReservation.type = editingReservation.type;
    }

    return defaultReservation;
};

export default getReservationFormValues;
