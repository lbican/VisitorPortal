import supabase from '../../database';
import { IProperty, TFormProperty } from '../utils/interfaces/typings';
import FileService, { IUploadedImage } from './file-service';

class PropertyService {
    static async createProperty(
        newProperty: TFormProperty,
        userId: string | undefined
    ): Promise<IProperty> {
        const { data, error } = await supabase.rpc('create_property', {
            p_description: null,
            p_image_path: newProperty.image_path,
            p_location: newProperty.location,
            p_name: newProperty.name,
            p_rating: newProperty.rating,
            p_type: newProperty.type,
            p_units: newProperty.units,
            p_user_id: userId,
        });

        if (error) {
            console.error(error);
            throw new Error(error.message);
        }

        return data;
    }

    static async updateProperty(
        property: TFormProperty,
        propertyId: string
    ): Promise<IProperty | null> {
        const { data, error } = await supabase.rpc('update_property', {
            p_id: propertyId,
            p_name: property.name,
            p_description: property.description,
            p_rating: property.rating,
            p_location: property.location,
            p_type: property.type,
            p_image_path: property.image_path,
            p_units: property.units,
        });

        if (error) {
            console.error(error);
            throw new Error(error.message);
        }

        return data;
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
