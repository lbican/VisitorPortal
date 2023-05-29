import React, { useState } from 'react';
import { BorderProps, Image, LayoutProps, Skeleton } from '@chakra-ui/react';
interface Props {
    imageLink: string;
    imageAlt: string;
    height?: LayoutProps['height'];
    width?: LayoutProps['width'];
    borderRadius?: BorderProps['borderRadius'];
}

const ProgressiveImage: React.FC<Props> = ({
    imageLink,
    imageAlt,
    height,
    width,
    borderRadius,
}) => {
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
                borderRadius={borderRadius}
                onLoad={(): void => {
                    setLoaded(true);
                }}
            />
            {!loaded && <Skeleton height="100%" width="100%" />}
        </>
    );
};

export default ProgressiveImage;
