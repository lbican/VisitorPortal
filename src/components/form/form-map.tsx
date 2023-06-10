import React, { useState, useEffect, useCallback } from 'react';
import { Map, Marker } from 'pigeon-maps';
import { osm } from 'pigeon-maps/providers';
import { MdLocationOn } from 'react-icons/md';
import axios from 'axios';
import { debounce } from 'lodash';

type FormMapProps = {
    onLocationChange: (location: string) => void;
    locationName?: string;
};

const OPEN_CAGE_API_KEY = '455b10c8942e48cba4ab9e1f35deb19f';

const FormMap: React.FC<FormMapProps> = ({ onLocationChange, locationName }) => {
    const [latitude, setLatitude] = useState<number>(44.30425);
    const [longitude, setLongitude] = useState<number>(15.10092);
    const [selectedOnMap, setSelectedOnMap] = useState<boolean>(false);

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

                    if (data.results.length > 0) {
                        const { lat, lng } = data.results[0].geometry;
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
            }

            void fetch();
        }, 500),
        [selectedOnMap]
    );

    useEffect(() => {
        void fetchLocationName();
    }, [latitude, longitude]);

    useEffect(() => {
        setSelectedOnMap(false);
        if (locationName) {
            debouncedFetchCoordinates(locationName);
        }
    }, [locationName, debouncedFetchCoordinates]);

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
