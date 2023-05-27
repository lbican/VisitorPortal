import { PropertyType, TNewProperty } from '../../../utils/interfaces/typings';

const getFormValues = (property?: TNewProperty) => {
    return property
        ? {
              name: property.name,
              type: property.type,
              rating: property.rating,
              location: property.location,
              description: property.description,
              image_url: property.image_url,
          }
        : {
              name: '',
              type: PropertyType.APARTMENT,
              rating: 0,
              location: '',
              description: undefined,
              image_url: '',
          };
};

export default getFormValues;
