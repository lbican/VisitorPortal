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
});

export default themeConfig;
