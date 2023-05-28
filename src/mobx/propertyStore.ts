import { action, observable, makeAutoObservable } from 'mobx';
import PropertyService from '../services/property-service';
import { IProperty, TNewProperty } from '../utils/interfaces/typings';

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
    async createProperty(propertyData: TNewProperty, userId?: string) {
        const data = await PropertyService.createProperty(propertyData, userId);
        this.setProperties([...this.properties, data]);
        return data;
    }

    @action
    updateProperty(propertyData: TNewProperty, propertyId: string) {
        return PropertyService.updateProperty(propertyData, propertyId);
    }

    @action
    deleteProperty(propertyId: string, imagePath: string) {
        this.setIsDeleting(true);
        return PropertyService.deleteProperty(propertyId, imagePath)
            .then(() => {
                this.setProperties(this.properties.filter((prop) => prop.id !== propertyId));
                this.setIsDeleting(false);
            })
            .catch((error) => {
                console.error(error);
                this.setIsDeleting(false);
            });
    }

    @action
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
}

export default new PropertyStore();
