import { IUploadedImage } from '../../../services/file-service';
import { Button, VStack } from '@chakra-ui/react';
import ProgressiveImage from '../../common/image/progressive-image';
import { GoTrash } from 'react-icons/go';
import React from 'react';
import { useTranslation } from 'react-i18next';

function FormImage(props: { image: IUploadedImage; loading: boolean; onClick: () => void }) {
    const { t } = useTranslation();

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
                leftIcon={<GoTrash />}
                onClick={props.onClick}
            >
                {t('Delete image')}
            </Button>
        </VStack>
    );
}

export default FormImage;
