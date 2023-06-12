import React, { ReactElement } from 'react';
import { Heading } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

const Team = (): ReactElement => {
    const { t } = useTranslation();
    return (
        <Heading as="h2" size="lg">
            {t('Team')}
        </Heading>
    );
};

export default Team;
