import supabase from '../../database';
import { IProperty, TNewProperty } from '../utils/interfaces/typings';

class PropertyService {
    static async createProperty(
        property: TNewProperty,
        userId: string | undefined
    ): Promise<TNewProperty | null> {
        console.log(property);
        if (!userId) {
            return Promise.reject('User is not logged in!');
        }
        const { data, error } = await supabase.from('Property').insert(property).select();

        if (error) {
            return Promise.reject(error);
        }

        if (data && data.length > 0) {
            const propertyData = data[0];

            const { error: linkError } = await supabase.from('User_has_Property').insert({
                user_id: userId,
                property_id: propertyData.id,
            });

            if (linkError) {
                console.error(linkError);
                return Promise.reject(linkError);
            }

            return propertyData as TNewProperty;
        }

        return null;
    }

    static async updateProperty(
        propertyId: string,
        property: TNewProperty
    ): Promise<TNewProperty | null> {
        return Promise.resolve(null);
    }

    static async getPropertiesForUser(userId?: string): Promise<IProperty[]> {
        if (!userId) {
            return Promise.reject('Unknown user provided!');
        }

        const { data, error } = await supabase.rpc('get_properties_for_user', {
            p_user_id: userId,
        });

        if (error) {
            return Promise.reject(error);
        }

        if (!data) {
            return [];
        }

        return data;
    }

    static async deletePropertyById(propertyId: string): Promise<void> {
        const { error } = await supabase.from('Property').delete().eq('id', propertyId);

        if (error) {
            return Promise.reject(error);
        }
    }
}

export default PropertyService;
