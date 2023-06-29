import React, { ReactElement } from 'react';
import EmptyState from '../../components/common/feedback/empty-state';
import SplitScreen from '../../components/layout/split-screen';
import { useTranslation } from 'react-i18next';
import getRandomImage from '../../utils/image';

const ErrorPage = (): ReactElement => {
    const { t } = useTranslation();

    return (
        <SplitScreen imageLink={getRandomImage}>
            <EmptyState
                code={404}
                shortMessage={t('Not found')}
                message={t('Requested page does not exist')}
            />
        </SplitScreen>
    );
};

export default ErrorPage;
