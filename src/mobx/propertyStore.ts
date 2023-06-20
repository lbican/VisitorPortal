import { makeAutoObservable } from 'mobx';
import PropertyService from '../services/property-service';
import {
    IProperty,
    IReservation,
    PropertyManager,
    TFormProperty,
} from '../utils/interfaces/typings';

class PropertyStore {
    properties: IProperty[] = [];
    currentProperty: IProperty | null = null;
    editingProperty: IProperty | undefined = undefined;
    propertyManagers: PropertyManager[] | undefined = undefined;
    isDeleting = false;
    isFetching = false;

    constructor() {
        makeAutoObservable(this);
    }

    setProperties(properties: IProperty[]) {
        this.properties = properties;
    }

    setCurrentProperty(property: IProperty | null) {
        this.currentProperty = property;
    }

    setEditingProperty(property: IProperty | undefined) {
        this.editingProperty = property;
    }

    setIsDeleting(value: boolean) {
        this.isDeleting = value;
    }

    setIsFetching(value: boolean) {
        this.isFetching = value;
    }

    setPropertyManagers(propertyManagers: PropertyManager[]) {
        this.propertyManagers = propertyManagers;
    }

    async createProperty(propertyData: TFormProperty, userId?: string) {
        const data = await PropertyService.createProperty(propertyData, userId);
        this.setProperties([...this.properties, data]);
        return data;
    }

    async updateProperty(propertyData: TFormProperty, propertyId: string): Promise<void> {
        const data = await PropertyService.updateProperty(propertyData, propertyId);
        this.setCurrentProperty(data);

        if (data) {
            const updatedProperties = this.properties.map((property) =>
                property.id === data.id ? data : property
            );
            this.setProperties(updatedProperties);
        }
    }

    async deleteProperty(propertyId: string, imagePath: string) {
        this.setIsDeleting(true);
        try {
            await PropertyService.deleteProperty(propertyId, imagePath);
            this.setProperties(this.properties.filter((prop) => prop.id !== propertyId));
        } finally {
            this.setIsDeleting(false);
        }
    }

    getCurrentProperty(propertyId: string) {
        if (this.currentProperty?.id !== propertyId) {
            const propertyIndex = this.properties.findIndex((property) => {
                return property.id == propertyId;
            });

            if (propertyIndex > -1) {
                this.setCurrentProperty(this.properties[propertyIndex]);
                return;
            }
        }
    }

    async fetchCurrentProperty(propertyId: string, userId?: string) {
        if (!userId) {
            console.error('Unknown user provided!');
            return;
        }
        this.setIsFetching(true);
        try {
            const data = await PropertyService.getUserProperty(propertyId, userId);
            const managerData = await PropertyService.getPropertyManagers(propertyId);
            if (data && managerData) {
                this.setCurrentProperty(data);
                this.setPropertyManagers(managerData);
            }
        } catch (error) {
            console.error(error);
        } finally {
            this.setIsFetching(false);
        }
    }

    fetchProperties(userId?: string): Promise<void> {
        this.setIsFetching(true);
        return PropertyService.getPropertiesByUserId(userId)
            .then((properties) => {
                this.setProperties(properties);
            })
            .catch((error) => {
                console.error(error);
            })
            .finally(() => {
                this.setIsFetching(false);
            });
    }

    resetStore() {
        this.properties = [];
        this.currentProperty = null;
        this.editingProperty = undefined;
        this.isDeleting = false;
        this.propertyManagers = [];
        this.isFetching = false;
    }
}

export const propertyStore = new PropertyStore();
