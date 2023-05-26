import supabase from '../../database';
import { TProperty } from '../utils/interfaces/typings';


class PropertyService {
    async createProperty(property: TProperty, userId: string): Promise<TProperty | null> {
        const { data, error } = await supabase.from('Property').insert(property).select();

        if (error) {
            throw error;
        }

        if (data && data.length > 0) {
            const propertyData = data[0];

            const { error: linkError } = await supabase.from('User_has_Property').insert({
                user_id: userId,
                property_id: propertyData.id,
            });

            if (linkError) {
                throw linkError;
            }

            return propertyData as TProperty;
        }

        return null;
    }
}

export default PropertyService;
