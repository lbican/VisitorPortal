import { PropertyType, TFormProperty } from '../../../utils/interfaces/typings';

const getFormValues = (property?: TFormProperty) => {
    return property
        ? {
              name: property.name,
              type: property.type,
              rating: property.rating,
              location: property.location,
              description: property.description,
              image_path: property.image_path,
          }
        : {
              name: '',
              type: PropertyType.APARTMENT,
              rating: 0,
              location: '',
              description: undefined,
              image_path: '',
          };
};

export default getFormValues;
