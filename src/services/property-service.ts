import supabase from '../../database';
import { IProperty, TFormProperty } from '../utils/interfaces/typings';
import FileService, { IUploadedImage } from './file-service';

class PropertyService {
    static async createProperty(
        property: TFormProperty,
        userId: string | undefined
    ): Promise<IProperty> {
        if (!userId) {
            throw new Error('User is not logged in!');
        }
        const { data, error } = await supabase.from('Property').insert(property).select();

        if (error) {
            throw new Error(error.message);
        }

        if (data && data.length > 0) {
            const propertyData = data[0];

            const { error: linkError } = await supabase.from('User_has_Property').insert({
                user_id: userId,
                property_id: propertyData.id,
            });

            if (linkError) {
                console.error(linkError);
                throw new Error(linkError.message);
            }

            return propertyData as IProperty;
        }

        throw new Error('Unknown error has occurred');
    }

    static async updateProperty(
        property: TFormProperty,
        propertyId: string
    ): Promise<IProperty | null> {
        const { data, error } = await supabase
            .from('Property')
            .update(property)
            .eq('id', propertyId)
            .select()
            .single();

        // Check for error
        if (error) {
            console.error('Error updating property:', error);
            throw new Error(error.message);
        }

        return data as IProperty;
    }

    static async getPropertiesByUserId(userId?: string): Promise<IProperty[]> {
        if (!userId) {
            throw new Error('Unknown user provided!');
        }

        const { data, error } = await supabase.rpc('get_properties_by_user_id', {
            p_user_id: userId,
        });

        if (error) {
            throw new Error(error.message);
        }

        if (!data) {
            return [];
        }

        return data;
    }

    /**
     * @param path - Path to supabase image
     * @returns path alongside resolved url from supabase
     */
    static getPropertyImage(path?: string): IUploadedImage | undefined {
        if (!path) {
            return undefined;
        }

        const PROPERTY_IMAGE_BUCKET = 'property_images';

        const image = supabase.storage.from(PROPERTY_IMAGE_BUCKET).getPublicUrl(path);
        return {
            url: image.data.publicUrl,
            path,
        };
    }

    static async deleteProperty(propertyId: string, imagePath: string): Promise<void> {
        const fileService = new FileService('property_images');
        const { error } = await supabase.from('Property').delete().eq('id', propertyId);

        await fileService.deleteFiles([imagePath]);

        if (error) {
            throw new Error(error.message);
        }
    }
}

export default PropertyService;
