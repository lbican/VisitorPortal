import React, { ReactElement } from 'react';
import EmptyState from '../../components/common/feedback/empty-state';
import SplitScreen from '../../components/layout/split-screen';
import { useTranslation } from 'react-i18next';

const ErrorPage = (): ReactElement => {
    const { t } = useTranslation();

    return (
        <SplitScreen imageLink="https://source.unsplash.com/1600x900/?horizon">
            <EmptyState
                code={404}
                shortMessage={t('Not found')}
                message={t('Requested page does not exist')}
            />
        </SplitScreen>
    );
};

export default ErrorPage;
