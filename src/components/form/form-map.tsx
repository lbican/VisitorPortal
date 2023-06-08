import React, { useState, useEffect } from 'react';
import { Map, Marker } from 'pigeon-maps';
import { osm } from 'pigeon-maps/providers';
import { MdLocationOn } from 'react-icons/md';
import axios from 'axios';

type FormMapProps = {
    onLocationChange: (location: string) => void;
    locationName?: string;
};

const OPEN_CAGE_API_KEY = '455b10c8942e48cba4ab9e1f35deb19f';

// Create a custom hook for debouncing
function useDebounce(value: any, delay: number) {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
}

const FormMap: React.FC<FormMapProps> = ({ onLocationChange, locationName }) => {
    const [latitude, setLatitude] = useState<number>(44.30425);
    const [longitude, setLongitude] = useState<number>(15.10092);
    const [selectedOnMap, setSelectedOnMap] = useState<boolean>(false);
    const debouncedLocationName = useDebounce(locationName, 500); // use debounced value

    const fetchLocationName = async () => {
        try {
            const response = await axios.get(
                `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${OPEN_CAGE_API_KEY}`
            );
            const data = response.data;

            const address = data.results[0]?.components;

            const location =
                address?.city || address?.town || address?.village || address?.hamlet || '';

            onLocationChange(location);
        } catch (error) {
            console.error('Failed to fetch location name: ', error);
        }
    };

    const fetchCoordinates = async (locationName: string) => {
        try {
            const response = await axios.get(
                `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(
                    locationName
                )}&key=${OPEN_CAGE_API_KEY}`
            );
            const data = response.data;

            if (data.results.length > 0) {
                const { lat, lng } = data.results[0].geometry;
                // Only update latitude and longitude if not currently selected on the map
                if (!selectedOnMap) {
                    setLatitude(lat);
                    setLongitude(lng);
                }
            } else {
                console.log('No results found for the given location name.');
            }
        } catch (error) {
            console.error('Failed to fetch coordinates: ', error);
        }
    };

    // Fetching location name on every latitude and longitude change
    useEffect(() => {
        void fetchLocationName();
    }, [latitude, longitude]);

    // Fetching coordinates whenever debouncedLocationName changes
    useEffect(() => {
        setSelectedOnMap(false);
        if (debouncedLocationName) {
            void fetchCoordinates(debouncedLocationName);
        }
    }, [debouncedLocationName]);

    return (
        <Map
            provider={osm}
            dprs={[1, 2]}
            height={200}
            defaultCenter={[latitude, longitude]}
            center={[latitude, longitude]}
            defaultZoom={11}
            onClick={({ latLng }) => {
                setSelectedOnMap(true);
                setLatitude(Number(latLng[0]));
                setLongitude(Number(latLng[1]));
            }}
        >
            <Marker anchor={[latitude, longitude]}>
                <MdLocationOn color="red" size="2rem" />
            </Marker>
        </Map>
    );
};

export default FormMap;
