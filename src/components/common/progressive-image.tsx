import React, { useState } from 'react';
import { Image, Skeleton } from '@chakra-ui/react';
interface Props {
    imageLink: string;
    imageAlt: string;
    height?: string;
    width?: string;
}

const ProgressiveImage: React.FC<Props> = ({ imageLink, imageAlt, height, width }) => {
    const [loaded, setLoaded] = useState(false);

    return (
        <>
            <Image
                display={loaded ? 'block' : 'none'}
                alt={imageAlt}
                objectFit="cover"
                src={imageLink}
                height={height}
                width={width}
                onLoad={(): void => {
                    setLoaded(true);
                }}
            />
            {!loaded && <Skeleton height="100%" width="100%" />}
        </>
    );
};

export default ProgressiveImage;
