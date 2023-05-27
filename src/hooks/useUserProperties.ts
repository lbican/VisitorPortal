import { useState, useEffect, useCallback } from 'react';
import { PostgrestError } from '@supabase/supabase-js';
import { IProperty } from '../utils/interfaces/typings';
import PropertyService from '../services/property-service';

const useUserProperties = (userId?: string) => {
    const [properties, setProperties] = useState<IProperty[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<PostgrestError | null>(null);

    const fetchUserProperties = useCallback(() => {
        setIsLoading(true);
        PropertyService.getPropertiesForUser(userId)
            .then((properties) => {
                setProperties(properties);
            })
            .catch((err) => {
                setError(err);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, [userId]);

    useEffect(() => {
        fetchUserProperties();
    }, [fetchUserProperties]);

    return { properties, isLoading, error, refetch: fetchUserProperties };
};

export default useUserProperties;
