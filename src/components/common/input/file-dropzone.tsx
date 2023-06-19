import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Box, Flex, HStack, Text, CircularProgress, Alert, AlertIcon } from '@chakra-ui/react';
import { AiOutlineUpload } from 'react-icons/ai';
import FileService from '../../../services/file-service';
import { useTranslation } from 'react-i18next';

interface FileDropzoneProps {
    fileService: FileService;
    setSelectedImage: (path: string) => void;
}

const FileDropzone: React.FC<FileDropzoneProps> = ({ setSelectedImage, fileService }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(false);
    const { t } = useTranslation();

    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        setIsLoading(true);
        setError(false);
        const file = acceptedFiles[0];

        try {
            const filePath = await fileService.uploadFile(file);
            setSelectedImage(filePath);
        } catch (error) {
            console.error(error);
            setError(true);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const { getRootProps, getInputProps, isFocused } = useDropzone({
        accept: { 'image/*': [] },
        maxFiles: 1,
        onDrop,
    });

    return (
        <>
            <Flex
                flexGrow={1}
                alignItems="center"
                borderRadius={4}
                border="2px dashed"
                height="100%"
                borderColor={isFocused ? 'blue.500' : 'gray.300'}
                transition="border .24s ease-in-out"
                backgroundColor="#eeeeee"
                color="gray.700"
            >
                <Box {...getRootProps()} w="full" padding={4}>
                    <input {...getInputProps()} />
                    <HStack spacing="2" justifyContent="center">
                        <AiOutlineUpload />
                        <Text>{t("Drag 'n' drop some files here, or click to select files")}</Text>
                    </HStack>
                    {isLoading && (
                        <Box display="flex" justifyContent="center" alignItems="center">
                            <CircularProgress isIndeterminate color="green.400" />
                        </Box>
                    )}
                </Box>
                {error && (
                    <Alert status="error">
                        <AlertIcon />
                        {t('There was an error processing your request, please try again later')}
                    </Alert>
                )}
            </Flex>
        </>
    );
};

export default FileDropzone;
