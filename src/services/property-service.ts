import supabase from '../../database';
import { IProperty, IUnit, TFormProperty } from '../utils/interfaces/typings';
import FileService, { IUploadedImage } from './file-service';
import { produce } from 'immer';

interface IFormPropertyUnit extends IUnit {
    property_id: string;
}

interface UserProperty {
    user_id: string;
    property_id: string;
}

type TPropertyWithoutUnits = Omit<TFormProperty, 'units'>;

class PropertyService {
    static async createProperty(
        property: TFormProperty,
        userId: string | undefined
    ): Promise<IProperty> {
        if (!userId) {
            throw new Error('User is not logged in!');
        }

        const { units, ...newProperty } = property;

        // Insert property
        const propertyData = (await this.insertIntoTableAndReturnSingle<TPropertyWithoutUnits>(
            'Property',
            newProperty
        )) as IProperty;

        // Link user with property
        await this.insertIntoTableAndReturnSingle<UserProperty>('User_has_Property', {
            user_id: userId,
            property_id: propertyData.id,
        });

        // Add units
        const propertyUnits: IFormPropertyUnit[] = units.map((unit) => {
            return {
                ...unit,
                property_id: propertyData.id,
            };
        });
        await this.insertIntoTable<IFormPropertyUnit>('Unit', propertyUnits);

        return produce(propertyData, (draftState) => {
            draftState.units = propertyUnits;
        });
    }

    private static async insertIntoTableAndReturnSingle<T>(table: string, data: T): Promise<T> {
        const { data: insertedData, error } = await supabase
            .from(table)
            .insert(data)
            .select()
            .single();

        if (error) {
            console.error(error);
            throw new Error(error.message);
        }

        if (!insertedData) {
            throw new Error('No data was returned from the insert operation');
        }

        return insertedData;
    }

    private static async insertIntoTable<T>(table: string, data: T[]): Promise<void> {
        const { error } = await supabase.from(table).insert(data);

        if (error) {
            console.error(error);
            throw new Error(error.message);
        }
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
