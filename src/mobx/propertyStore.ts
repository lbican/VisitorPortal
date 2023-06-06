import { action, observable, makeAutoObservable } from 'mobx';
import PropertyService from '../services/property-service';
import { IProperty, TFormProperty } from '../utils/interfaces/typings';

class PropertyStore {
    @observable properties: IProperty[] = [];
    @observable currentProperty: IProperty | null = null;
    @observable editingProperty: IProperty | undefined = undefined;
    @observable isDeleting = false;
    @observable isFetching = false;

    constructor() {
        makeAutoObservable(this);
    }

    @action
    setProperties(properties: IProperty[]) {
        this.properties = properties;
    }

    @action
    setCurrentProperty(property: IProperty | null) {
        this.currentProperty = property;
    }

    @action
    setEditingProperty(property: IProperty | undefined) {
        this.editingProperty = property;
    }

    @action
    setIsDeleting(value: boolean) {
        this.isDeleting = value;
    }

    @action
    setIsFetching(value: boolean) {
        this.isFetching = value;
    }

    @action
    async createProperty(propertyData: TFormProperty, userId?: string) {
        const data = await PropertyService.createProperty(propertyData, userId);
        this.setProperties([...this.properties, data]);
        return data;
    }

    @action
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

    @action
    async deleteProperty(propertyId: string, imagePath: string) {
        this.setIsDeleting(true);
        try {
            await PropertyService.deleteProperty(propertyId, imagePath);
            this.setProperties(this.properties.filter((prop) => prop.id !== propertyId));
        } finally {
            this.setIsDeleting(false);
        }
    }

    @action
    getCurrentProperty(propertyId: string) {
        if (this.currentProperty?.id !== propertyId) {
            const propertyIndex = this.properties.findIndex((property) => {
                return property.id == propertyId;
            });

            if (propertyIndex > -1) {
                this.setCurrentProperty(this.properties[propertyIndex]);
                return;
            }

            //TODO - Implement logic that will get current property if not clicked from properties menu
        }
    }

    @action
    fetchProperties(userId?: string): Promise<void> {
        this.setIsFetching(true);
        return PropertyService.getPropertiesByUserId(userId)
            .then((properties) => {
                console.log(properties);
                this.setProperties(properties);
            })
            .catch((error) => {
                console.error(error);
            })
            .finally(() => {
                this.setIsFetching(false);
            });
    }

    @action
    resetStore() {
        this.properties = [];
        this.currentProperty = null;
        this.editingProperty = undefined;
        this.isDeleting = false;
        this.isFetching = false;
    }
}

export const propertyStore = new PropertyStore();
