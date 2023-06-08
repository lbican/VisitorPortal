import React, { useState, useEffect } from 'react';
import { Map, Marker } from 'pigeon-maps';
import { osm } from 'pigeon-maps/providers';
import { MdLocationOn } from 'react-icons/md';
import axios from 'axios';

type GeoCodeResponse = {
    address: {
        city_district?: string;
        city?: string;
        village?: string;
        [key: string]: string | undefined;
    };
};

type FormMapProps = {
    onLocationChange: (location: string) => void;
};

const FormMap: React.FC<FormMapProps> = ({ onLocationChange }) => {
    const [latitude, setLatitude] = useState<number>(44.30425);
    const [longitude, setLongitude] = useState<number>(15.10092);

    useEffect(() => {
        const fetchLocationName = async () => {
            try {
                const response = await axios.get<GeoCodeResponse>(
                    `https://geocode.maps.co/reverse?lat=${latitude}&lon=${longitude}`
                );
                const { address } = response.data;

                const location = address.city_district || address.city || address.village || '';
                onLocationChange(location);
            } catch (error) {
                console.error('Failed to fetch location name: ', error);
            }
        };

        void fetchLocationName();
    }, [latitude, longitude, onLocationChange]);

    return (
        <Map
            provider={osm}
            dprs={[1, 2]}
            height={200}
            defaultCenter={[latitude, longitude]}
            defaultZoom={11}
            onClick={({ latLng }) => {
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
