import React, { useState, useEffect, useCallback } from 'react';
import { Map, Marker } from 'pigeon-maps';
import { osm } from 'pigeon-maps/providers';
import { MdLocationOn } from 'react-icons/md';
import axios from 'axios';
import { debounce } from 'lodash';
import { Spinner } from '@chakra-ui/react';

type FormMapProps = {
    onLocationChange: (location: string) => void;
    locationName?: string;
};

const OPEN_CAGE_API_KEY = '455b10c8942e48cba4ab9e1f35deb19f';

const FormMap: React.FC<FormMapProps> = ({ onLocationChange, locationName }) => {
    const [latitude, setLatitude] = useState<number | null>(null);
    const [longitude, setLongitude] = useState<number | null>(null);
    const [selectedOnMap, setSelectedOnMap] = useState<boolean>(false);

    const fetchLocationName = async () => {
        if (latitude && longitude) {
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
        }
    };

    const debouncedFetchCoordinates = useCallback(
        debounce((locationName: string) => {
            async function fetch() {
                try {
                    const response = await axios.get(
                        `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(
                            locationName
                        )}&key=${OPEN_CAGE_API_KEY}`
                    );
                    const data = response.data;

                    if (data.results.length > 0 && !selectedOnMap) {
                        const { lat, lng } = data.results[0].geometry;
                        setLatitude(lat);
                        setLongitude(lng);
                    } else {
                        console.log('No results found for the given location name.');
                        setLatitude(0);
                        setLongitude(0);
                    }
                } catch (error) {
                    console.error('Failed to fetch coordinates: ', error);
                }
            }

            void fetch();
        }, 500),
        [selectedOnMap]
    );

    useEffect(() => {
        void fetchLocationName();
    }, [latitude, longitude]);

    useEffect(() => {
        if (locationName) {
            debouncedFetchCoordinates(locationName);
        } else {
            setLongitude(0);
            setLatitude(0);
        }
    }, [locationName, debouncedFetchCoordinates]);

    if (latitude === null || longitude === null) {
        return <Spinner size="lg" />;
    }

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
