import {
    IFormReservation,
    IGuest,
    IReservation,
    ReservationType,
} from '../../../utils/interfaces/typings';

const getReservationFormValues = (
    unitId: string,
    date_range: [Date, Date],
    reservation?: IReservation
): IFormReservation & Partial<IGuest> => {
    return reservation
        ? {
              id: reservation.id,
              guest_id: reservation.guest.id,
              unit_id: reservation.unit.id,
              date_range: [
                  reservation.date_range[0] || new Date(),
                  reservation.date_range[1] || new Date(),
              ],
              total_price: reservation.total_price,
              note: reservation.note,
              first_name: reservation.guest.first_name,
              last_name: reservation.guest.last_name,
              guests_num: reservation.guest.guests_num,
              prepayment_paid: reservation.prepayment_paid,
              prepayment_percent: reservation.prepayment_percent,
              country: reservation.guest.country,
              type: reservation.type,
          }
        : {
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
};

export default getReservationFormValues;
