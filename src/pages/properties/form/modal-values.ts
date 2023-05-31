import { PropertyType, TFormProperty } from '../../../utils/interfaces/typings';

/**
 * Returns default form values for editing or creating new property
 * @param property - Property we want to edit
 */
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
