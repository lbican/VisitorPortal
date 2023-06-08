import { IUploadedImage } from '../../../services/file-service';
import { Button, VStack } from '@chakra-ui/react';
import ProgressiveImage from '../../common/image/progressive-image';
import { GoTrashcan } from 'react-icons/go';
import React from 'react';

function FormImage(props: { image: IUploadedImage; loading: boolean; onClick: () => void }) {
    return (
        <VStack alignItems="flex-end" mt={2} w="full">
            <ProgressiveImage
                imageLink={props.image.url}
                imageAlt="Property image"
                width="full"
                height="18rem"
                borderRadius="md"
            />
            <Button
                variant="solid"
                colorScheme="red"
                isLoading={props.loading}
                leftIcon={<GoTrashcan />}
                onClick={props.onClick}
            >
                Delete image
            </Button>
        </VStack>
    );
}

export default FormImage;
