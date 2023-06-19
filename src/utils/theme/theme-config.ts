import { extendTheme, type ThemeConfig } from '@chakra-ui/react';
import { StepsTheme as Steps } from 'chakra-ui-steps';

const config: ThemeConfig = {
    initialColorMode: 'dark',
    useSystemColorMode: true,
};

const themeConfig = extendTheme({
    components: {
        Steps,
    },
    ...config,
    colors: {
        chart: {
            light: {
                labels: '#111111',
                gridLines: '#dddddd',
            },
            dark: {
                labels: '#eeeeee',
                gridLines: '#444444',
            },
        },
    },
});

export default themeConfig;
