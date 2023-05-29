import React, { ReactElement } from 'react';
import EmptyState from '../../components/common/feedback/empty-state';
import SplitScreen from '../../components/layout/split-screen';

const ErrorPage = (): ReactElement => {
    return (
        <SplitScreen imageLink="https://source.unsplash.com/1600x900/?horizon">
            <EmptyState
                code={404}
                shortMessage="Not found"
                message="Requested page does not exist"
            />
        </SplitScreen>
    );
};

export default ErrorPage;
