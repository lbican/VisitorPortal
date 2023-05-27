// stores/PropertyStoreContext.ts
import { createContext, useContext } from 'react';
import propertyStore from './propertyStore'; // Note the lowercase "p", this is an instance not the class itself

const PropertyStoreContext = createContext(propertyStore);

export const usePropertyStore = () => useContext(PropertyStoreContext);

export default PropertyStoreContext;
