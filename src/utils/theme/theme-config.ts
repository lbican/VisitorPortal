import { extendTheme, type ThemeConfig } from '@chakra-ui/react';

const config: ThemeConfig = {
    initialColorMode: 'dark',
    useSystemColorMode: true,
};

const themeConfig = extendTheme({
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
